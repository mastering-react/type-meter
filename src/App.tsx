import { useRef, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { LuTimer } from "react-icons/lu";
import { twMerge } from "tailwind-merge";
import Button from "./components/button";
import Select from "./components/select";
import SummaryCard from "./components/summary-card";
import Textarea from "./components/textarea";

// Sample paragraphs for typing tests
const sampleTexts = [
  "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once. Pangrams are often used to display font samples and test keyboards.",
  "In programming, attention to detail is crucial. Every character, every semicolon, and every bracket matters. Good programmers develop muscle memory for common patterns while maintaining accuracy.",
  "Technology continues to evolve at a rapid pace. What was cutting-edge yesterday might be obsolete tomorrow. Adaptability and continuous learning are key skills in this field.",
  "The best way to learn a new skill is to practice regularly. Consistent practice helps build muscle memory and improve performance. Set aside time each day to work on your craft.",
  "The internet is a vast repository of knowledge. With the right search terms, you can find answers to almost any question. Remember to fact-check and verify sources before sharing information.",
];

function App() {
  const [isTestRunning, setIsTestRunning] = useState(false);

  const [content, setContent] = useState(sampleTexts[0]);

  const [value, setValue] = useState("");

  const [duration, setDuration] = useState(60);

  const [timeLeft, setTimeLeft] = useState(duration);

  const inervalRef = useRef<NodeJS.Timeout | null>(null);

  const [stats, setStats] = useState({
    wpm: 0,
    cpm: 0,
    accuracy: 0,
    errors: 0,
  });

  const startTest = () => {
    setIsTestRunning(true);
    setTimeLeft(duration);
    setStats({
      wpm: 0,
      cpm: 0,
      accuracy: 0,
      errors: 0,
    });
    inervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 0) {
          resetTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetTest = () => {
    if (inervalRef.current) {
      clearInterval(inervalRef.current);
    }
    calculateStats();
    setIsTestRunning(false);
    setContent(sampleTexts[Math.floor(Math.random() * sampleTexts.length)]);
    setValue("");
  };

  const calculateStats = () => {
    const words = value.trim().split(" ").length;
    const characters = value.length;

    const timeSpent = (duration - timeLeft) / 60;

    const wpm = Math.round(words / timeSpent);

    const cpm = Math.round(characters / timeSpent);

    let errors = 0;

    const minLength = Math.min(content.length, value.length);

    for (let i = 0; i < minLength; i++) {
      if (content[i] !== value[i]) {
        errors++;
      }
    }

    const accuracy = Math.round(((characters - errors) / characters) * 100);

    setStats({
      wpm,
      cpm,
      accuracy,
      errors,
    });
  };

  const formatTime = (duration: number) => {
    return (
      Math.floor(duration / 60) +
      ":" +
      (duration % 60).toString().padStart(2, "0")
    );
  };

  const renderText = () => {
    return content.split("").map((char, index) => {
      let color = "";

      if (value.length > index) {
        const isCorrect = value[index] === char;
        color = isCorrect ? "text-green-500" : "text-red-500";
      }

      return (
        <span key={index} className={color}>
          {char}
        </span>
      );
    });
  };

  return (
    <main className="bg-slate-100 h-screen flex items-center justify-center p-6">
      <section className="border p-6 rounded-lg bg-white w-full max-w-4xl">
        <div className="flex">
          <h1 className="text-xl font-semibold">Typing Speed Calculator</h1>
          <div className="ms-auto flex items-center gap-2">
            <Select
              value={duration.toString()}
              onValueChange={(value) => setDuration(parseInt(value))}
            >
              <Select.Trigger className="w-32">
                <Select.Value placeholder="Select" />
              </Select.Trigger>
              <Select.Content className="p-2">
                <Select.Item value="30">30 Seconds</Select.Item>
                <Select.Item value="60">1 Minutes</Select.Item>
                <Select.Item value="120">2 Minutes</Select.Item>
              </Select.Content>
            </Select>
            <Button
              className={twMerge(
                "inline-flex items-center gap-2",
                isTestRunning
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-slate-800 hover:bg-slate-900"
              )}
              onClick={isTestRunning ? resetTest : startTest}
            >
              <FiRefreshCw size={18} />
              {isTestRunning ? "Reset" : "Start"}
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 justify-center">
          <LuTimer size={28} />
          <span className="text-xl font-semibold">
            {isTestRunning ? formatTime(timeLeft) : formatTime(duration)}
          </span>
        </div>
        <div className="p-6 mt-4 bg-slate-50 rounded-lg">
          <p className="text-slate-500 text-justify">{renderText()}</p>
        </div>
        <Textarea
          className="mt-4"
          rows={4}
          placeholder="Start typing here..."
          disabled={!isTestRunning}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="mt-6 grid grid-cols-4 gap-4">
          <SummaryCard value={stats.wpm.toString()} unit="WPM" />
          <SummaryCard value={stats.cpm.toString()} unit="CPM" />
          <SummaryCard value={`${stats.accuracy}%`} unit="Accuracy" />
          <SummaryCard value={stats.errors.toString()} unit="Errors" />
        </div>
      </section>
    </main>
  );
}

export default App;
