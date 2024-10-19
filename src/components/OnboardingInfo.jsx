import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function OnboardingInfo() {
  return (
    <Card className="mt-8">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-2">Почему стоит присоединиться к нам?</h3>
        <ul className="space-y-2">
          <li className="flex items-center">
            <Badge variant="secondary" className="mr-2">AI</Badge>
            Персонализированные курсы, созданные с помощью ИИ
          </li>
          <li className="flex items-center">
            <Badge variant="secondary" className="mr-2">EXP</Badge>
            Зарабатывайте опыт и поднимайтесь в рейтинге
          </li>
          <li className="flex items-center">
            <Badge variant="secondary" className="mr-2">Гибкость</Badge>
            Учитесь в своем темпе, в любое время
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}
