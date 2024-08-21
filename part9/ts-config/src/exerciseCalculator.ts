interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface calculateExercisesValues {
  objectValue: number;
  exercises: number[];
}

function parseArguments(args: string[]): any {
  if (args.length < 4) throw new Error("Not enough arguments");
  const objectValue = args.slice(2, 3);
  const exercises = args.slice(3).map((item) => +item);

  if (!isNaN(Number(objectValue)) && !isNaN(Number(...exercises))) {
    return {
      objectValue: Number(objectValue),
      exercises: exercises,
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
}

function calculateExercises(
  exerciseTimePerDay: number[],
  exerciseTimeExpectedPerDay: number
): Result {
  let ratingDescription = "";
  const totalExerciseTime = exerciseTimePerDay.reduce(
    (acc, current) => acc + current,
    0
  );
  const success =
    totalExerciseTime >= exerciseTimeExpectedPerDay * exerciseTimePerDay.length;
  let rating = 0;
  const exerciseTimeAcomplish = exerciseTimePerDay.filter(
    (item) => item > exerciseTimeExpectedPerDay
  );
  if (exerciseTimeAcomplish.length >= exerciseTimePerDay.length) {
    rating = 3;
  } else if (exerciseTimeAcomplish.length >= exerciseTimePerDay.length / 2) {
    rating = 2;
  } else {
    rating = 1;
  }
  if (rating === 3) {
    ratingDescription = "Excelent work, keep going!!!";
  } else if (rating === 2) {
    ratingDescription = "not too bad but could be better";
  } else {
    ratingDescription = "You need to work more next time";
  }

  return {
    periodLength: exerciseTimePerDay.length,
    trainingDays: exerciseTimePerDay.filter((item) => item > 0).length,
    success,
    rating,
    ratingDescription,
    target: exerciseTimeExpectedPerDay,
    average: totalExerciseTime / exerciseTimePerDay.length,
  };
}

try {
  const { objectValue, exercises } = parseArguments(process.argv);
  console.log(calculateExercises(exercises, objectValue));
} catch (error: unknown) {
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}
