import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown, Clock, Calendar, User, Users, BookOpen } from 'lucide-react'
import { getContrastColor } from "@/lib/utils"

const difficultyColors = {
  Beginner: "bg-green-500",
  Intermediate: "bg-yellow-500",
  Advanced: "bg-red-500"
};

export function CourseDetails({ course, onClose, onEnroll }) {
  const [likeStatus, setLikeStatus] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);

  const bgColor = `hsl(${Math.random() * 360}, 70%, 80%)`;
  const textColor = getContrastColor(bgColor);
  const words = course.title.split(' ');
  const displayText = words.slice(0, 3).join(' ');

  const handleLike = (isLike) => {
    setLikeStatus(isLike);
    setShowEmoji(true);
    setTimeout(() => {
      setLikeStatus(null);
      setShowEmoji(false);
    }, 2000);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
        <div 
          className="relative aspect-video flex items-center justify-center text-2xl font-bold p-4 text-center" 
          style={{ backgroundColor: bgColor, color: textColor }}
        >
          <Badge className="absolute top-2 left-2">{course.category}</Badge>
          {displayText}
          {showEmoji && (
            <div className="absolute inset-0 flex items-center justify-center text-6xl animate-bounce">
              {likeStatus ? '🎉' : '💩'}
            </div>
          )}
        </div>
        <div className="p-4">
          <DialogHeader>
            <DialogTitle>{course.title}</DialogTitle>
            <DialogDescription>{course.description}</DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-2 my-4">
            <Badge variant="outline" className="flex items-center justify-center p-2">
              <BookOpen className="mr-2" size={16} />
              {course.level}
            </Badge>
            <Badge variant="outline" className="flex items-center justify-center p-2">
              <Clock className="mr-2" size={16} />
              {course.duration}
            </Badge>
            <Badge variant="outline" className="flex items-center justify-center p-2">
              <User className="mr-2" size={16} />
              {course.author?.username || 'Unknown Author'}
            </Badge>
            <Badge variant="outline" className="flex items-center justify-center p-2">
              <Users className="mr-2" size={16} />
               873 участников
            </Badge>
          </div>
          
          <div className="flex justify-between mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleLike(true)}
              className={`transition-all duration-300 ${likeStatus === true ? 'bg-green-500 text-white' : ''}`}
            >
              <ThumbsUp size={16} className="mr-2" />
              Нравится
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleLike(false)}
              className={`transition-all duration-300 ${likeStatus === false ? 'bg-red-500 text-white' : ''}`}
            >
              <ThumbsDown size={16} className="mr-2" />
              Не нравится
            </Button>
          </div>
          
          <Button className="w-full" onClick={onEnroll}>Участвовать в курсе</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
