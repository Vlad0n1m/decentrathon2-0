import { generateTopicContent } from './gemini';
import { PrismaClient } from '@prisma/client';
import debounce from 'lodash/debounce';

const prisma = new PrismaClient();
const pendingTasks = new Map();
const processingDelay = 5000; // 5 seconds delay between processing tasks

export function addBackgroundTask(courseId, topicId) {
  if (!pendingTasks.has(courseId)) {
    pendingTasks.set(courseId, new Set());
  }
  pendingTasks.get(courseId).add(topicId);
  debouncedProcessNextTask();
}

async function processNextTask() {
  for (const [courseId, topics] of pendingTasks.entries()) {
    const topicId = topics.values().next().value;
    if (topicId) {
      try {
        const response = await fetch('/api/background-tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ courseId, topicId }),
        });

        if (!response.ok) {
          throw new Error('Failed to process background task');
        }

        topics.delete(topicId);
        if (topics.size === 0) {
          pendingTasks.delete(courseId);
        }
      } catch (error) {
        console.error('Error processing background task:', error);
      }
    }
  }
  if (pendingTasks.size > 0) {
    debouncedProcessNextTask();
  }
}

const debouncedProcessNextTask = debounce(processNextTask, processingDelay);

async function updateTopicContent(topicId, content) {
  await prisma.topic.update({
    where: { id: topicId },
    data: { content, status: 'COMPLETED' },
  });
}
