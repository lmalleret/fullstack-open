interface bmiValues {
  height: number;
  weight: number;
}

function parseArguments(args: string[]): bmiValues {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 4) throw new Error("Too many arguments");

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]) / 100,
      weight: Number(args[3]),
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
}

export function calculateBmi(height: number, weight: number): string {
  const bmi = weight / (height ^ 2);
  if (bmi < 18.5) {
    return "Low (unhealthy weight)";
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    return "Normal (healthy weight)";
  } else if (bmi > 24.9 && bmi <= 29.9) {
    return "Overweight (unhealthy weight)";
  }
  return "Obesity (unhealthy weight)";
}

try {
  const { height, weight } = parseArguments(process.argv);
  console.log(calculateBmi(height, weight));
} catch (error: unknown) {
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}
