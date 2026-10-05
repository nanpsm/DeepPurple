interface Props {
  topics: string[];
}

export default function TopicCloud({ topics }: Props) {
  if (!topics.length) {
    return <p className="text-gray-400 text-sm">No topics detected</p>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {topics.map(topic => (
        <span key={topic} className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
          {topic}
        </span>
      ))}
    </div>
  );
}
