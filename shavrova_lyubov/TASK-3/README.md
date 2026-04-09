using System;
using System.Collections.Generic;

namespace DanceSchoolLambdaVisitorDemo
{
    public interface IDance
    {
        T Accept<T>(Func<IDance, T> visitor);
    }

    public abstract class DanceBase : IDance
    {
        protected abstract Dictionary<Type, Func<IDance, object>> GetVisitTable();

        public T Accept<T>(Func<IDance, T> visitor)
        {
            var table = GetVisitTable();
            var type = GetType();
            
            if (table.TryGetValue(type, out var handler))
            {
                return (T)handler(this);
            }
            
            return visitor(this);
        }
    }

    public class Ballet : DanceBase
    {
        public int DifficultyLevel { get; }
        
        public Ballet(int difficultyLevel)
        {
            DifficultyLevel = difficultyLevel;
        }

        protected override Dictionary<Type, Func<IDance, object>> GetVisitTable()
        {
            return new Dictionary<Type, Func<IDance, object>>
            {
                { typeof(string), dance => $"Балет (сложность {((Ballet)dance).DifficultyLevel}/10)" },
                { typeof(decimal), dance => 100m + ((Ballet)dance).DifficultyLevel * 10m }
            };
        }
    }

    public class HipHop : DanceBase
    {
        public int EnergyLevel { get; }
        
        public HipHop(int energyLevel)
        {
            EnergyLevel = energyLevel;
        }

        protected override Dictionary<Type, Func<IDance, object>> GetVisitTable()
        {
            return new Dictionary<Type, Func<IDance, object>>
            {
                { typeof(string), dance => $"Hip-Hop (энергия {((HipHop)dance).EnergyLevel}/10)" },
                { typeof(decimal), dance => 80m + ((HipHop)dance).EnergyLevel * 5m }
            };
        }
    }

    public class Tango : DanceBase
    {
        public bool HasPartner { get; }
        
        public Tango(bool hasPartner)
        {
            HasPartner = hasPartner;
        }

        protected override Dictionary<Type, Func<IDance, object>> GetVisitTable()
        {
            return new Dictionary<Type, Func<IDance, object>>
            {
                { typeof(string), dance => ((Tango)dance).HasPartner ? "Танго (есть партнер)" : "Танго (без партнера)" },
                { typeof(decimal), dance => ((Tango)dance).HasPartner ? 120m : 150m }
            };
        }
    }

    public static class LambdaVisitor
    {
        public static string GetDescription(IDance dance)
        {
            return dance switch
            {
                Ballet b => $"Балет (сложность {b.DifficultyLevel}/10)",
                HipHop h => $"Hip-Hop (энергия {h.EnergyLevel}/10)",
                Tango t => t.HasPartner ? "Танго (есть партнер)" : "Танго (без партнера)",
                _ => "Неизвестный танец"
            };
        }

        public static decimal GetPrice(IDance dance)
        {
            return dance switch
            {
                Ballet b => 100 + b.DifficultyLevel * 10,
                HipHop h => 80 + h.EnergyLevel * 5,
                Tango t => t.HasPartner ? 120 : 150,
                _ => 0
            };
        }
    }

    class Program
    {
        static void Main()
        {
            var dances = new List<IDance>
            {
                new Ballet(8),
                new HipHop(9),
                new Tango(false)
            };

            Console.WriteLine("=== Lambda Visitor (через switch expression) ===\n");
            
            foreach (var dance in dances)
            {
                string description = LambdaVisitor.GetDescription(dance);
                decimal price = LambdaVisitor.GetPrice(dance);
                Console.WriteLine($"{description} — цена: {price} руб.");
            }
        }
    }
}