import { useState } from "react";

const App = () => {
  // guarda los clics de cada botón en su propio estado
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleSetGood = () => {
    setGood(good + 1);
  };

  const handleSetNeutral = () => {
    setNeutral(neutral + 1);
  };

  const handleSetBad = () => {
    setBad(bad + 1);
  };

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={handleSetGood} text="good" />
      <Button onClick={handleSetNeutral} text="neutral" />
      <Button onClick={handleSetBad} text="bad" />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};

const Statistics = ({ good, neutral, bad }) => {
  const totalFeedbacks = good + neutral + bad;

  const calcAverage = () => {
    const sum = good - bad;
    const averageScore = sum / totalFeedbacks;
    return averageScore.toFixed(2);
  };

  const calcGoodPercentage = () => {
    const positiveFeedbacks = good;
    const positivePercentage = (positiveFeedbacks / totalFeedbacks) * 100;
    return positivePercentage.toFixed(2);
  };

  return totalFeedbacks === 0 ? (
    <p>No feedback given</p>
  ) : (
    <table>
      <tbody>
        <StatisticsLine text="good" value={good} />

        <StatisticsLine text="neutral" value={neutral} />

        <StatisticsLine text="bad" value={bad} />

        <StatisticsLine text="all" value={totalFeedbacks} />

        <StatisticsLine text="average" value={calcAverage()} />

        <StatisticsLine text="positive" value={calcGoodPercentage() + "%"} />
      </tbody>
    </table>
  );
};

const StatisticsLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

export default App;
