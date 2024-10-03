"use client"

import { useState, useEffect, useRef } from 'react'
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Network } from 'vis-network/standalone'
import { DataSet } from 'vis-data/standalone'
import { Search, Filter, BarChart2, Book, BookOpen, Layers, Share2, Download, Save, User, Settings, LogOut, Calendar as CalendarIcon } from 'lucide-react'
import { format } from "date-fns"

interface Paper {
  id: string
  title: string
  author: string
  organization: string
  language: string
  releaseDate: string
  publicationType: string
  bibliometricIndicators: {
    citations: number
    hIndex: number
    impactFactor: number
  }
  summary: string
  conclusions: string
  keywords: string[]
  fullText: string
  references: string[]
}

interface Dot {
  x: number
  y: number
  r: number
  color: string
}

export function ScientificResearchPlatform() {
  const [searchCriteria, setSearchCriteria] = useState({
    publicationTitle: '',
    keyword: '',
    textSearch: '',
    udcNumber: '',
    author: '',
    journalName: '',
    publicationDate: null as Date | null,
    language: 'RU',
    exactMatch: false,
    searchOtherLanguages: false,
    citationRange: [0, 100],
    publicationTypes: [] as string[],
    impactFactorRange: [0, 10]
  })

  const [searchPerformed, setSearchPerformed] = useState(false)
  const [papers, setPapers] = useState<Paper[]>([])
  const [selectedPapers, setSelectedPapers] = useState<Paper[]>([])
  const [dots, setDots] = useState<Dot[]>([])
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [globalAnalysis, setGlobalAnalysis] = useState<string | null>(null)
  const [savedSearches, setSavedSearches] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState('dashboard')

  const networkRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (searchPerformed) {
      generateDots()
    }
  }, [searchPerformed])

  useEffect(() => {
    if (networkRef.current && papers.length > 0) {
      const nodes = new DataSet(
        papers.map((paper, index) => ({
          id: index,
          label: paper.title,
          value: paper.bibliometricIndicators.citations
        }))
      )

      const edges = new DataSet(
        papers.flatMap((paper, index) => 
          paper.references.map((ref, refIndex) => ({
            from: index,
            to: papers.findIndex(p => p.title === ref)
          })).filter(edge => edge.to !== -1)
        )
      )

      const data = { nodes, edges }

      const options = {
        nodes: {
          shape: 'dot',
          scaling: {
            min: 10,
            max: 30,
            label: {
              min: 8,
              max: 30,
              drawThreshold: 12,
              maxVisible: 20
            }
          }
        },
        edges: {
          width: 0.15,
          color: { inherit: 'from' },
          smooth: {
            type: 'continuous'
          }
        },
        physics: {
          stabilization: false,
          barnesHut: {
            gravitationalConstant: -80000,
            springConstant: 0.001,
            springLength: 200
          }
        },
        interaction: { hover: true }
      }

      const network = new Network(networkRef.current, data, options)
    }
  }, [papers])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setSearchCriteria(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string) => {
    setSearchCriteria(prev => ({ ...prev, [name]: !prev[name as keyof typeof prev] }))
  }

  const handleSearch = () => {
    setSearchPerformed(true)
    // Mock data for demonstration
    setPapers([
      {
        id: '1',
        title: 'Квантовые нейронные сети: интеграция квантовых вычислений и глубокого обучения',
        author: 'Иванов И.И.',
        organization: 'Институт квантовой информатики',
        language: 'Русский',
        releaseDate: '2023-05-15',
        publicationType: 'Научная статья',
        bibliometricIndicators: {
          citations: 45,
          hIndex: 12,
          impactFactor: 4.5
        },
        summary: 'В данной статье исследуется синергия квантовых вычислений и глубокого обучения, представляя новую парадигму квантовых нейронных сетей. Мы демонстрируем, как квантовые алгоритмы могут значительно ускорить обучение сложных нейронных архитектур и открыть новые возможности для решения задач, недоступных классическим методам.',
        conclusions: 'Наше исследование показывает, что квантовые нейронные сети обладают потенциалом для революционных прорывов в области искусственного интеллекта, особенно в задачах оптимизации и моделирования сложных квантовых систем. Однако для полной реализации этого потенциала требуется дальнейшее развитие квантовых технологий и алгоритмов.',
        keywords: ['квантовые вычисления', 'глубокое обучение', 'нейронные сети', 'квантовый искусственный интеллект'],
        fullText: "Полный текст статьи...",
        references: ['Квантовые вычисления: теория и практика в эпоху NISQ-устройств', 'Трансформерные модели в обработке естественного языка: достижения и перспективы']
      },
      {
        id: '2',
        title: 'Квантовые вычисления: теория и практика в эпоху NISQ-устройств',
        author: 'Петров П.П.',
        organization: 'Квантовый исследовательский центр',
        language: 'Русский',
        releaseDate: '2023-04-20',
        publicationType: 'Обзорная статья',
        bibliometricIndicators: {
          citations: 78,
          hIndex: 15,
          impactFactor: 5.2
        },
        summary: 'Обзор современного состояния квантовых вычислений, включая теоретические основы и практические применения в контексте NISQ-устройств (Noisy Intermediate-Scale Quantum).',
        conclusions: 'Квантовые вычисления на NISQ-устройствах показывают значительный потенциал в решении определенных классов вычислительных задач, особенно в области оптимизации и моделирования квантовых систем. Однако для широкого практического применения требуется дальнейшее развитие технологий квантовой коррекции ошибок.',
        keywords: ['квантовые вычисления', 'NISQ', 'квантовые алгоритмы', 'квантовая оптимизация'],
        fullText: "Полный текст статьи...",
        references: ['Квантовые нейронные сети: интеграция квантовых вычислений и глубокого обучения']
      },
      {
        id: '3',
        title: 'Трансформерные модели в обработке естественного языка: достижения и перспективы',
        author: 'Сидорова С.С.',
        organization: 'Лаборатория искусственного интеллекта',
        language: 'Русский',
        releaseDate: '2023-06-01',
        publicationType: 'Экспериментальное исследование',
        bibliometricIndicators: {
          citations: 32,
          hIndex: 8,
          impactFactor: 3.8
        },
        summary: 'Исследование применения различных архитектур трансформерных моделей для задач обработки естественного языка, включая анализ их эффективности и масштабируемости.',
        conclusions: 'Трансформерные модели, особенно их крупномасштабные версии, показали выдающиеся результаты в широком спектре задач NLP, включая машинный перевод, генерацию текста и ответы на вопросы. Однако их применение сопряжено с высокими вычислительными затратами, что стимулирует исследования в области оптимизации и компрессии моделей.',
        keywords: ['обработка естественного языка', 'трансформеры', 'машинное обучение', 'NLP'],
        fullText: "Полный текст статьи...",
        references: ['Квантовые нейронные сети: интеграция квантовых вычислений и глубокого обучения']
      }
    ])
    setSelectedPapers([])
    setShowAnalysis(false)
    setGlobalAnalysis(null)
  }

  const generateDots = () => {
    const newDots: Dot[] = []
    for (let i = 0; i < 50; i++) {
      newDots.push({
        x: Math.random() * 300,
        y: Math.random() * 200,
        r: Math.random() * 5 + 2,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`
      })
    }
    setDots(newDots)
  }

  const handlePaperSelection = (paper: Paper) => {
    setSelectedPapers(prev => 
      prev.some(p => p.id === paper.id)
        ? prev.filter(p => p.id !== paper.id)
        : [...prev, paper]
    )
  }

  const handleGlobalAnalysis = () => {
    setGlobalAnalysis("На основе анализа найденных статей можно сделать вывод, что современные исследования в области информационных технологий сосредоточены на трех основных направлениях: квантовые вычисления с акцентом на NISQ-устройства и их интеграцию с методами машинного обучения, развитие трансформерных моделей для задач обработки естественного языка, и исследование синергии квантовых вычислений и искусственного интеллекта. Эти области демонстрируют значительный прогресс и потенциал для революционных прорывов в решении сложных вычислительных задач и улучшения взаимодействия человека с компьютером.")
    setShowAnalysis(true)
  }

  const handleSaveSearch = () => {
    const searchName = `Поиск ${savedSearches.length + 1}`
    setSavedSearches(prev => [...prev, searchName])
  }

  const handleExportCitations = () => {
    const citations = selectedPapers.map(paper => 
      `${paper.author} (${new Date(paper.releaseDate).getFullYear()}). ${paper.title}. ${paper.organization}.`
    ).join('\n\n')
    
    const blob = new Blob([citations], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'citations.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Научно-исследовательская платформа</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Button variant="ghost" onClick={() => setActiveTab('dashboard')}>
                  Обзор
                </Button>
              </li>
              <li>
                <Button variant="ghost" onClick={() => setActiveTab('search')}>
                  Поиск
                </Button>
              </li>
              <li>
                <Button variant="ghost" onClick={()=> setActiveTab('analysis')}>
                  Анализ
                </Button>
              </li>
              <li>
                <Button variant="ghost" onClick={() => setActiveTab('library')}>
                  Библиотека
                </Button>
              </li>
            </ul>
          </nav>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/01.png" alt="@username" />
                  <AvatarFallback>ИИ</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Иванов И.И.</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    ivanov@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Профиль</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Настройки</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Выйти</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Обзор</TabsTrigger>
            <TabsTrigger value="search">Поиск</TabsTrigger>
            <TabsTrigger value="analysis">Анализ</TabsTrigger>
            <TabsTrigger value="library">Библиотека</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Всего публикаций
                  </CardTitle>
                  <Book className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,345</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% по сравнению с прошлым месяцем
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Средний импакт-фактор
                  </CardTitle>
                  <BarChart2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.28</div>
                  <p className="text-xs text-muted-foreground">
                    +2.5% по сравнению с прошлым годом
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Активные исследования
                  </CardTitle>
                  <Layers className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">573</div>
                  <p className="text-xs text-muted-foreground">
                    +201 новых за последний месяц
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Цитирования
                  </CardTitle>
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12,234</div>
                  <p className="text-xs text-muted-foreground">
                    +19% по сравнению с прошлым годом
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Публикационная активность</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={papers}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="author" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="bibliometricIndicators.citations" fill="#8884d8" name="Цитирования" />
                      <Bar dataKey="bibliometricIndicators.hIndex" fill="#82ca9d" name="h-индекс" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Распределение по областям исследований</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Квантовые вычисления', value: 45 },
                          { name: 'Искусственный интеллект', value: 30 },
                          { name: 'Обработка естественного языка', value: 25 }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        {papers.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="search">
            <Card>
              <CardHeader>
                <CardTitle>Расширенный поиск</CardTitle>
                <CardDescription>Настройте параметры для точного поиска научных публикаций</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="publicationTitle">Название публикации</Label>
                    <Input 
                      id="publicationTitle" 
                      name="publicationTitle" 
                      value={searchCriteria.publicationTitle}
                      onChange={handleInputChange}
                      placeholder="Введите название"
                    />
                  </div>
                  <div>
                    <Label htmlFor="keyword">Ключевое слово</Label>
                    <Input 
                      id="keyword" 
                      name="keyword" 
                      value={searchCriteria.keyword}
                      onChange={handleInputChange}
                      placeholder="Введите ключевое слово"
                    />
                  </div>
                  <div>
                    <Label htmlFor="textSearch">Поиск в тексте</Label>
                    <Input 
                      id="textSearch" 
                      name="textSearch" 
                      value={searchCriteria.textSearch}
                      onChange={handleInputChange}
                      placeholder="Введите текст для поиска"
                    />
                  </div>
                  <div>
                    <Label htmlFor="udcNumber">Номер УДК</Label>
                    <Input 
                      id="udcNumber" 
                      name="udcNumber" 
                      value={searchCriteria.udcNumber}
                      onChange={handleInputChange}
                      placeholder="Введите номер УДК"
                    />
                  </div>
                  <div>
                    <Label htmlFor="author">Автор</Label>
                    <Input 
                      id="author" 
                      name="author" 
                      value={searchCriteria.author}
                      onChange={handleInputChange}
                      placeholder="Введите имя автора"
                    />
                  </div>
                  <div>
                    <Label htmlFor="journalName">Название журнала</Label>
                    <Input 
                      id="journalName" 
                      name="journalName" 
                      value={searchCriteria.journalName}
                      onChange={handleInputChange}
                      placeholder="Введите название журнала"
                    />
                  </div>
                  <div>
                    <Label htmlFor="publicationDate">Дата публикации</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={`w-full justify-start text-left font-normal ${
                            !searchCriteria.publicationDate && "text-muted-foreground"
                          }`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {searchCriteria.publicationDate ? format(searchCriteria.publicationDate, "PPP") : <span>Выберите дату</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={searchCriteria.publicationDate || undefined}
                          onSelect={(date) => setSearchCriteria(prev => ({ ...prev, publicationDate: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label htmlFor="language">Язык публикации</Label>
                    <Select 
                      id="language" 
                      name="language" 
                      value={searchCriteria.language}
                      onValueChange={(value) => handleInputChange({ target: { name: 'language', value } } as any)}
                    >
                      <option value="RU">Русский</option>
                      <option value="EN">English</option>
                      <option value="DE">Deutsch</option>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="exactMatch"
                      checked={searchCriteria.exactMatch}
                      onCheckedChange={() => handleSwitchChange('exactMatch')}
                    />
                    <Label htmlFor="exactMatch">Точное совпадение для поиска</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="searchOtherLanguages"
                      checked={searchCriteria.searchOtherLanguages}
                      onCheckedChange={() => handleSwitchChange('searchOtherLanguages')}
                    />
                    <Label htmlFor="searchOtherLanguages">Искать на других языках</Label>
                  </div>
                </div>
                <div>
                  <Label>Диапазон цитирований</Label>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={searchCriteria.citationRange}
                    onValueChange={(value) => setSearchCriteria(prev => ({ ...prev, citationRange: value }))}
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{searchCriteria.citationRange[0]}</span>
                    <span>{searchCriteria.citationRange[1]}</span>
                  </div>
                </div>
                <div>
                  <Label>Диапазон импакт-фактора</Label>
                  <Slider
                    min={0}
                    max={10}
                    step={0.1}
                    value={searchCriteria.impactFactorRange}
                    onValueChange={(value) => setSearchCriteria(prev => ({ ...prev, impactFactorRange: value }))}
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{searchCriteria.impactFactorRange[0]}</span>
                    <span>{searchCriteria.impactFactorRange[1]}</span>
                  </div>
                </div>
                <div>
                  <Label>Тип публикации</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Научная статья', 'Обзорная статья', 'Экспериментальное исследование', 'Монография'].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          checked={searchCriteria.publicationTypes.includes(type)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSearchCriteria(prev => ({ ...prev, publicationTypes: [...prev.publicationTypes, type] }))
                            } else {
                              setSearchCriteria(prev => ({ ...prev, publicationTypes: prev.publicationTypes.filter(t => t !== type) }))
                            }
                          }}
                        />
                        <Label htmlFor={type}>{type}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button onClick={handleSearch}>
                    <Search className="mr-2 h-4 w-4" /> Поиск
                  </Button>
                  <Button variant="outline" onClick={handleSaveSearch}>
                    <Save className="mr-2 h-4 w-4" /> Сохранить поиск
                  </Button>
                </div>
              </CardContent>
            </Card>
            {searchPerformed && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Результаты поиска</span>
                    <div className="space-x-2">
                      <Button variant="outline" onClick={handleGlobalAnalysis}>
                        <BarChart2 className="mr-2 h-4 w-4" /> Анализ результатов
                      </Button>
                      <Button variant="outline" onClick={handleExportCitations} disabled={selectedPapers.length === 0}>
                        <Download className="mr-2 h-4 w-4" /> Экспорт цитат
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px] w-full rounded-md border p-4">
                    <ul className="space-y-4">
                      {papers.map(paper => (
                        <li key={paper.id} className="border p-4 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{paper.title}</h3>
                              <p className="text-sm text-gray-600">{paper.author}, {paper.releaseDate}</p>
                              <p className="text-sm text-gray-500">{paper.organization}</p>
                              <p className="text-xs text-gray-400">{paper.publicationType}</p>
                              <div className="mt-2 space-x-2">
                                {paper.keywords.map(keyword => (
                                  <Badge key={keyword} variant="secondary">{keyword}</Badge>
                                ))}
                              </div>
                            </div>
                            <Checkbox
                              checked={selectedPapers.some(p => p.id === paper.id)}
                              onCheckedChange={() => handlePaperSelection(paper)}
                            />
                          </div>
                          <div className="mt-4 flex justify-between items-center">
                            <div className="space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Book className="mr-2 h-4 w-4" /> Подробнее
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                  <DialogHeader>
                                    <DialogTitle>{paper.title}</DialogTitle>
                                  </DialogHeader>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold">Автор</h4>
                                      <p>{paper.author}</p>
                                      <h4 className="font-semibold mt-2">Организация</h4>
                                      <p>{paper.organization}</p>
                                      <h4 className="font-semibold mt-2">Дата публикации</h4>
                                      <p>{paper.releaseDate}</p>
                                      <h4 className="font-semibold mt-2">Тип публикации</h4>
                                      <p>{paper.publicationType}</p>
                                      <h4 className="font-semibold mt-2">Библиометрические показатели</h4>
                                      <p>Цитирований: {paper.bibliometricIndicators.citations}</p>
                                      <p>Индекс Хирша: {paper.bibliometricIndicators.hIndex}</p>
                                      <p>Импакт-фактор: {paper.bibliometricIndicators.impactFactor}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold">Краткое содержание</h4>
                                      <p>{paper.summary}</p>
                                      <h4 className="font-semibold mt-2">Выводы</h4>
                                      <p>{paper.conclusions}</p>
                                      <h4 className="font-semibold mt-2">Ключевые слова</h4>
                                      <div className="flex flex-wrap gap-2">
                                        {paper.keywords.map(keyword => (
                                          <Badge key={keyword} variant="secondary">{keyword}</Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <BarChart2 className="mr-2 h-4 w-4" /> Анализ
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                  <DialogHeader>
                                    <DialogTitle>Анализ статьи</DialogTitle>
                                  </DialogHeader>
                                  <div className="mt-4">
                                    <h4 className="font-semibold">Краткое содержание</h4>
                                    <p>{paper.summary}</p>
                                    <h4 className="font-semibold mt-2">Выводы</h4>
                                    <p>{paper.conclusions}</p>
                                    <h4 className="font-semibold mt-4">Связанные статьи</h4>
                                    <div className="h-[300px] w-full bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                                      <div ref={networkRef} style={{ width: '100%', height: '100%' }} />
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                            <div className="text-sm text-gray-500">
                              <span className="mr-2">Цитирований: {paper.bibliometricIndicators.citations}</span>
                              <span>h-индекс: {paper.bibliometricIndicators.hIndex}</span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="analysis">
            <Card>
              <CardHeader>
                <CardTitle>Глобальный анализ</CardTitle>
              </CardHeader>
              <CardContent>
                {globalAnalysis ? (
                  <div className="space-y-4">
                    <p>{globalAnalysis}</p>
                    <h3 className="text-lg font-semibold">Статистика публикаций</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={papers}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="author" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="bibliometricIndicators.citations" fill="#8884d8" name="Цитирования" />
                        <Bar dataKey="bibliometricIndicators.hIndex" fill="#82ca9d" name="h-индекс" />
                      </BarChart>
                    </ResponsiveContainer>
                    <h3 className="text-lg font-semibold">Облако ключевых слов</h3>
                    <div className="h-[300px] w-full bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                      <svg width="100%" height="100%" viewBox="0 0 300 300">
                        {dots.map((dot, index) => (
                          <g key={index}>
                            <circle
                              cx={dot.x}
                              cy={dot.y}
                              r={dot.r}
                              fill={dot.color}
                            />
                            <text
                              x={dot.x}
                              y={dot.y}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fontSize={dot.r * 0.8}
                              fill="white"
                            >
                              {papers[index % papers.length].keywords[0]}
                            </text>
                          </g>
                        ))}
                      </svg>
                    </div>
                  </div>
                ) : (
                  <p>Выполните поиск и нажмите "Анализ результатов" для просмотра глобального анализа.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="library">
            <Card>
              <CardHeader>
                <CardTitle>Сохраненные поиски</CardTitle>
              </CardHeader>
              <CardContent>
                {savedSearches.length > 0 ? (
                  <ul className="space-y-2">
                    {savedSearches.map((search, index) => (
                      <li key={index} className="flex justify-between items-center p-2 border rounded">
                        <span>{search}</span>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>У вас пока нет сохраненных поисков.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}