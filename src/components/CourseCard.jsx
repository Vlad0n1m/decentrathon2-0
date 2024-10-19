import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getContrastColor } from "@/lib/utils"

const difficultyColors = {
  easy: "bg-green-500",
  medium: "bg-yellow-500",
  hard: "bg-red-500"
};

const difficultyLabels = {
  easy: "Легкий",
  medium: "Средний",
  hard: "Сложный"
};

export function CourseCard({ course, onClick }) {
  const bgColor = `hsl(${Math.random() * 360}, 70%, 80%)`;
  const textColor = getContrastColor(bgColor);
  const words = course.title.split(' ');
  const displayText = words.slice(0, 3).join(' ');

  return (
    <Card 
      className="w-full cursor-pointer transition-transform hover:scale-105 overflow-hidden"
      onClick={() => onClick(course)}
    >
      <div 
        className="relative aspect-video flex items-center justify-center text-xl font-bold p-4 text-center" 
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        {displayText}
        <Badge className="absolute top-2 right-2">{course.category}</Badge>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 truncate">{course.title}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className={`w-3 h-3 rounded-full ${difficultyColors[course.level]} mr-2`}></span>
            <span className="text-sm">{difficultyLabels[course.level]}</span>
          </div>
          <span className="text-sm text-gray-500">{course.participants} участников</span>
        </div>
      </div>
    </Card>
  );
}
