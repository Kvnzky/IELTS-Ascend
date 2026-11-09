import { WritingPrompt } from '../types/ielts';

export const WRITING_PROMPTS: WritingPrompt[] = [
  // ================= ACADEMIC TASK 1: LINE GRAPH =================
  {
    id: 'acad-w-t1-line',
    examType: 'academic',
    taskType: 'task1',
    title: 'Renewable Electricity Generation in Four European Countries (2000–2020)',
    subType: 'line-graph',
    promptText:
      'The line graph illustrates the percentage of total electricity produced from renewable energy sources in Germany, Denmark, France, and the UK between 2000 and 2020.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
    visualData: {
      type: 'line',
      dataPoints: {
        years: [2000, 2005, 2010, 2015, 2020],
        series: [
          { name: 'Denmark', color: '#dc2626', values: [30, 42, 55, 68, 80] },
          { name: 'Germany', color: '#2563eb', values: [10, 18, 30, 42, 52] },
          { name: 'UK', color: '#16a34a', values: [4, 7, 15, 28, 45] },
          { name: 'France', color: '#9333ea', values: [12, 14, 16, 19, 23] },
        ],
        maxY: 100,
      },
      caption: 'Percentage of National Electricity Generated from Renewable Sources (2000–2020)',
    },
    suggestedDurationMinutes: 20,
    minWordCount: 150,
    keyChecklist: [
      'Paraphrase the prompt in the introduction without copying',
      'Provide a clear overview highlighting overall upward trajectory and Denmark as dominant',
      'Group data logically: leaders (Denmark & Germany) in one body paragraph; UK & France in another',
      'Quote exact percentages and years to support statements',
      'Do not include personal opinions or reasons for the trends',
    ],
    modelAnswers: [
      {
        band: 9,
        essay: `The line graph illustrates the proportion of electricity generated from renewable sources across four European nations—namely Denmark, Germany, the United Kingdom, and France—over a twenty-year period spanning from 2000 to 2020.

Overall, it is immediately apparent that all four countries experienced an upward trajectory in their adoption of renewable electricity. Denmark maintained a decisive lead throughout the entire timeframe, while the UK demonstrated the most dramatic proportional expansion. Conversely, France exhibited the most moderate growth.

In 2000, Denmark was already the clear frontrunner, generating 30% of its electricity via renewables. This figure escalated steadily over the next two decades, culminating in a remarkable high of 80% by 2020. Germany also witnessed considerable progress, commencing at precisely 10% in 2000 and experiencing continuous, steady acceleration to finish at 52%, more than quintupling its initial output.

By contrast, the UK began with the lowest proportion in 2000 at a modest 4%. However, after a relatively gradual rise to 15% in 2010, British renewable generation surged exponentially over the subsequent decade, overtaking France around 2013 and reaching 45% in 2020. Meanwhile, France recorded the most stagnant development, moving marginally from 12% in 2000 to 23% by 2020, ultimately ranking lowest by the end of the period.`,
        examinerComment:
          'Band 9.0: Masterful execution. The overview clearly synthesizes overarching trends and contrasts. Data is categorized logically with sophisticated sentence structures, precise prepositions, varied transitional devices, and zero grammatical blemishes.',
      },
      {
        band: 7,
        essay: `The line graph gives information about the percentage of electricity produced from green sources in Denmark, Germany, the UK, and France between 2000 and 2020.

Overall, all countries increased their use of renewable electricity over the twenty years. Denmark had the highest figures throughout, while France grew the slowest.

Regarding Denmark, it started at 30% in 2000 and rose steadily to reach 80% in 2020. Germany also increased from 10% in 2000 to 52% in 2020, showing steady upward growth.

On the other hand, the UK started with only 4% in 2000, but increased fast after 2010 to end up at 45% in 2020. France started at 12% in 2000, which was higher than Germany and the UK, but only reached 23% by 2020.`,
        examinerComment:
          'Band 7.0: Satisfies all requirements with a clear overview and appropriate data selection. Lexical range is good, though repetitive in sentence structures ("rose steadily", "increased"). Grammatically accurate.',
      },
    ],
  },

  // ================= ACADEMIC TASK 1: BAR CHART =================
  {
    id: 'acad-w-t1-bar',
    examType: 'academic',
    taskType: 'task1',
    title: 'Consumer Expenditure by Category across Three Age Demographics (2023)',
    subType: 'bar-chart',
    promptText:
      'The bar chart compares the percentage of annual household expenditure allocated to five distinct categories by three different age groups in the UK in 2023.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
    visualData: {
      type: 'bar',
      dataPoints: {
        categories: ['Housing', 'Food', 'Transport', 'Healthcare', 'Leisure'],
        demographics: [
          { name: 'Under 30', color: '#3b82f6', values: [38, 16, 20, 5, 21] },
          { name: '30 to 50', color: '#10b981', values: [32, 22, 18, 11, 17] },
          { name: 'Over 50', color: '#f59e0b', values: [18, 24, 12, 28, 18] },
        ],
        maxY: 100,
      },
      caption: 'Proportion of Annual Household Spending by Category across Age Groups (2023)',
    },
    suggestedDurationMinutes: 20,
    minWordCount: 150,
    keyChecklist: [
      'State the five categories and three demographic cohorts in the introduction',
      'Provide an overview noting that housing dominates for younger cohorts, while healthcare dominates for the oldest',
      'Compare highest spending in Housing (Under 30 at 38%) with Healthcare (Over 50 at 28%)',
      'Highlight similarities (e.g. food expenditure between 30-50 and over 50)',
    ],
    modelAnswers: [
      {
        band: 9,
        essay: `The bar chart delineates the proportion of annual household expenditure devoted to five essential consumer sectors—namely housing, food, transport, healthcare, and leisure—across three distinct age cohorts in the United Kingdom during 2023.

Overall, it is evident that housing consumed the largest share of expenditure for individuals under 50, particularly the youngest demographic, whereas healthcare represented the primary financial commitment for the elderly cohort. Conversely, transport and leisure spending exhibited greater parity across all demographics.

For citizens aged under 30, housing constituted the single greatest expense at 38%, noticeably higher than the 32% recorded for 30-to-50-year-olds and more than double the 18% spent by those over 50. In stark contrast, healthcare spending revealed an inverse pattern: the over-50 demographic allocated 28% of their budget to medical needs, compared to a mere 11% for middle-aged consumers and only 5% for young adults.

Regarding nutritional and lifestyle expenditure, food allocation rose steadily with age, shifting from 16% among under-30s to 22% and 24% for the older cohorts respectively. Transport expenditures peaked in the youngest category at 20%, slightly exceeding the 18% and 12% spent by the middle and senior brackets. Finally, leisure spending remained remarkably consistent across all three groups, fluctuating between 17% and 21%.`,
        examinerComment:
          'Band 9.0: Exceptional clarity and grouping. The overview contrasts the dominance of housing for the youth against healthcare for seniors. Data is clustered coherently with complex comparative phrasing.',
      },
    ],
  },

  // ================= ACADEMIC TASK 1: PROCESS DIAGRAM =================
  {
    id: 'acad-w-t1-process',
    examType: 'academic',
    taskType: 'task1',
    title: 'The Industrial Recycling Cycle of Plastic Bottles into Fleece Garments',
    subType: 'process',
    promptText:
      'The flow diagram illustrates the industrial process of transforming post-consumer plastic bottles into recycled fleece clothing.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
    visualData: {
      type: 'process',
      dataPoints: {
        steps: [
          { stepNumber: 1, title: 'Collection & Sorting', description: 'Used plastic bottles collected from recycling bins and sorted by polymer type.' },
          { stepNumber: 2, title: 'Crushing & Washing', description: 'Bottles are compressed, washed thoroughly, and shredded into tiny clean flakes.' },
          { stepNumber: 3, title: 'Melting & Pelleting', description: 'Clean plastic flakes heated to 260°C and extruded into uniform polymer pellets.' },
          { stepNumber: 4, title: 'Yarn Spinning', description: 'Melted pellets pushed through spinnerets to form fine polyester yarn strands.' },
          { stepNumber: 5, title: 'Weaving & Dyeing', description: 'Yarn strands woven on industrial looms and dyed with eco-friendly pigments.' },
          { stepNumber: 6, title: 'Garment Manufacturing', description: 'Finished fleece fabric tailored into recycled outdoor jackets and blankets.' },
        ],
      },
      caption: 'Six-Stage Linear Cycle of Synthetic Fleece Production from Recycled PET',
    },
    suggestedDurationMinutes: 20,
    minWordCount: 150,
    keyChecklist: [
      'Count and state total stages (6 distinct stages from waste collection to finished garment)',
      'Use sequential linking markers: First, Subsequently, Following this, In the subsequent stage, Finally',
      'Employ passive voice throughout: "are collected", "is shredded", "are extruded"',
      'Do not give personal opinions on recycling',
    ],
    modelAnswers: [
      {
        band: 9,
        essay: `The diagram delineates the linear sequence of industrial operations involved in transforming discarded plastic containers into finished fleece textiles.

Overall, the process comprises six main stages, commencing with the municipal collection and mechanical sorting of post-consumer bottles and culminating in the tailoring of commercial fleece clothing. The procedure relies heavily on mechanical shredding, thermal extrusion, and textile weaving.

In the initial stage, post-consumer PET bottles are collected from designated disposal depots and mechanically segregated to eliminate non-recyclable contaminants. Subsequently, the sorted plastic is compacted, washed in sanitizing solutions, and pulverized into minute flakes.

Following the cleansing phase, these flakes are transferred to high-temperature industrial kilns, where they are melted at approximately 260 degrees Celsius and extruded into uniform synthetic pellets. In stage four, these pellets are reheated and forced through microscopic spinneret nozzles to yield continuous polyester filament yarn. In the fifth step, the yarn is spun onto industrial looms to weave raw fabric before undergoing dyeing. Finally, the finished fleece fabric is cut and sewn into wearable outdoor apparel such as fleece jackets.`,
        examinerComment:
          'Band 9.0: Masterful passive constructions ("are collected", "is compacted", "are extruded"), precise sequential transitions, and a clear overarching summary of total stages.',
      },
    ],
  },

  // ================= GENERAL TRAINING TASK 1: FORMAL COMPLAINT LETTER =================
  {
    id: 'gt-w-t1-complaint',
    examType: 'general',
    taskType: 'task1',
    title: 'Formal Letter: Complaint Regarding Delayed Airline Baggage',
    subType: 'letter-formal',
    promptText:
      'You recently travelled by plane and your luggage was delayed for three days, causing you considerable inconvenience and financial expense.\n\nWrite a letter to the airline manager. In your letter:\n- Explain details of your flight and baggage\n- Describe the problems and inconvenience this delay caused you\n- State what action or compensation you expect from the airline\n\nWrite at least 150 words. You do NOT need to write any addresses. Begin your letter with: Dear Sir or Madam,',
    letterContext: {
      recipient: 'Customer Relations Manager, Continental Airways',
      requiredBulletPoints: [
        'Flight details, booking reference, and baggage tag numbers',
        'Specific inconvenience and essential purchases incurred',
        'Demand for financial reimbursement and formal explanation',
      ],
    },
    suggestedDurationMinutes: 20,
    minWordCount: 150,
    keyChecklist: [
      'Maintain an uncompromisingly formal, polite, and professional register',
      'Include a clear statement of purpose in the opening sentence',
      'Address all three prompt bullet points in dedicated paragraphs',
      'Provide realistic details (flight code, baggage tag, monetary figure)',
      'Use formal closing sign-off: "Yours faithfully,"',
    ],
    modelAnswers: [
      {
        band: 9,
        essay: `Dear Sir or Madam,

I am writing to formally lodge a complaint regarding the mishandling and prolonged delay of my checked luggage following flight CA-408 from London Heathrow to Toronto on October 14th (Booking Reference: #KL9921B).

Upon arrival at Toronto Pearson Airport, my suitcase failed to appear on the carousel. I immediately registered a Property Irregularity Report with your ground staff (PIR Reference: YYZCA10482). Despite assurances that my bag would be delivered to my hotel within twenty-four hours, it was not returned until seventy-two hours later.

This delay caused immense personal distress and disruption. I was attending an international academic conference the following morning, and my suitcase contained my formal attire, presentation materials, and vital prescription medication. Consequently, I was compelled to expend $480 CAD on emergency business clothing, toiletries, and replacement pharmaceuticals, receipts for which are enclosed herewith.

In light of this unacceptable inconvenience, I request immediate full reimbursement of my incurred expenses totalling $480 CAD, in accordance with the Montreal Convention regulations. Furthermore, I expect a written explanation detailing why your baggage tracking service failed to communicate the whereabouts of my belongings.

I trust you will treat this matter with the urgency it warrants and look forward to receiving your prompt settlement within fourteen working days.

Yours faithfully,

Jonathan Caldwell`,
        examinerComment:
          'Band 9.0: Impeccable formal tone throughout. The purpose is crystal clear from sentence one, all bullet points are addressed with convincing realistic depth, cohesive flow is natural, and vocabulary is exemplary.',
      },
    ],
  },

  // ================= GENERAL TRAINING TASK 1: REQUEST LETTER =================
  {
    id: 'gt-w-t1-request',
    examType: 'general',
    taskType: 'task1',
    title: 'Semi-Formal Letter: Request to Transfer Course and Schedule',
    subType: 'letter-semi-formal',
    promptText:
      'You are currently enrolled in an evening certificate course at a local college. Due to unexpected changes in your work hours, you need to change to the weekend class.\n\nWrite a letter to your course tutor. In your letter:\n- Explain what course you are currently attending\n- Give reasons why you can no longer attend evening classes\n- Request a transfer to the weekend session and ask about any steps required\n\nWrite at least 150 words. You do NOT need to write any addresses. Begin your letter with: Dear Mr./Ms. [Tutor Name],',
    letterContext: {
      recipient: 'Course Tutor, City Vocational College',
      requiredBulletPoints: [
        'Course name, student ID, and current evening schedule',
        'Explanation of new work commitments and overtime duties',
        'Polite request to join the Saturday session and check syllabus alignment',
      ],
    },
    suggestedDurationMinutes: 20,
    minWordCount: 150,
    keyChecklist: [
      'Maintain polite, respectful, and cooperative semi-formal tone',
      'State your current student ID and course title clearly',
      'Cover all three bullet points with logical transitions',
      'Sign off appropriately with: "Yours sincerely,"',
    ],
    modelAnswers: [
      {
        band: 9,
        essay: `Dear Ms. Thornton,

I am writing to formally request a transfer from my current Tuesday evening class to the alternate Saturday morning cohort for the Advanced Project Management Certificate (Student ID: PM-49201).

I have thoroughly enjoyed the initial three weeks of instruction under your guidance. However, my employer has recently assigned me to lead an urgent regional infrastructure project. This unforeseen commitment requires me to supervise on-site operational testing on weekday evenings from 5:00 PM to 9:00 PM, creating a direct scheduling conflict with our classes.

Because I remain deeply committed to completing this qualification, I would be immensely grateful if you could approve my transfer to the Saturday cohort meeting between 9:30 AM and 1:30 PM. I have confirmed with several classmates that both sections are adhering to identical syllabus milestones, so I will be fully prepared for this weekend's seminar.

Could you please let me know whether I need to complete an administrative transfer form with the registry office, or if your written consent suffices? Thank you very much for your understanding and continued support.

Yours sincerely,

Marcus Vance`,
        examinerComment:
          'Band 9.0: Perfectly calibrated semi-formal register. Addresses the tutor respectfully, articulates the problem clearly, and proposes a constructive remedy.',
      },
    ],
  },

  // ================= TASK 2 (BOTH TRACKS): DISCUSS BOTH VIEWS ESSAY =================
  {
    id: 'both-w-t2-university-fees',
    examType: 'academic',
    taskType: 'task2',
    title: 'University Education: Free State Provision vs Student Tuition Fees',
    subType: 'discussion',
    promptText:
      'Some people believe that university education should be completely free for all citizens, funded entirely by national governments. Others argue that students should pay their own tuition fees as higher education primarily benefits the individual.\n\nDiscuss both views and give your own opinion. Give reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
    suggestedDurationMinutes: 40,
    minWordCount: 250,
    keyChecklist: [
      'Paraphrase the prompt in the introduction and formulate a clear thesis statement',
      'Body Paragraph 1: Discuss the case for free state-funded tertiary education (social equity, economic innovation)',
      'Body Paragraph 2: Discuss the argument for student-paid tuition fees (personal career gains, fiscal burden on taxpayers)',
      'Clearly present your own opinion and explain why one side is more compelling',
      'Conclusion: Summarize key arguments without introducing new points',
    ],
    modelAnswers: [
      {
        band: 9,
        essay: `The debate surrounding the funding mechanisms for tertiary education has garnered substantial attention in contemporary socioeconomic discourse. While proponents of state-sponsored tuition contend that higher education is a fundamental public good that should be universal, opponents maintain that beneficiaries should personally finance their studies due to the private financial advantages accrued. This essay will examine both perspectives before arguing that a balanced hybrid system represents the most equitable approach.

Advocates of entirely state-funded higher education anchor their rationale on principles of egalitarianism and macro-economic vitality. If universities are accessible irrespective of socioeconomic origin, social mobility is profoundly democratized, enabling talented individuals from impoverished backgrounds to fulfill their intellectual potential. Furthermore, a highly educated populace generates immense societal dividends: higher tax revenues, technological innovation, and reduced reliance on public welfare. Scandinavian nations, such as Norway and Finland, exemplify this model, consistently ranking among the world's most innovative economies precisely because state-funded universities foster widespread technical expertise.

Conversely, those advocating for tuition fees emphasize individual return on investment and fiscal prudence. A university degree confers substantial personal remuneration; on average, university graduates command considerably higher lifetime earnings than non-graduates. Consequently, compelling working-class taxpayers—many of whom did not attend university themselves—to subsidize degrees for future high-earning professionals can be viewed as inherently regressive. Furthermore, when institutions rely solely on government funding, they frequently encounter budgetary constraints that undermine infrastructure, faculty recruitment, and research capabilities, a predicament avoided by tuition-funded universities in North America.

In conclusion, although state funding promotes social justice and broader economic development, the private benefits conferred by higher education justify personal financial contribution. In my view, the most pragmatic solution is an income-contingent deferred loan scheme, where tuition is covered upfront by the state and repaid by graduates only after their earnings surpass an established median threshold. This guarantees universal access while preserving fiscal fairness.`,
        examinerComment:
          'Band 9.0: A benchmark academic essay. The position is stated transparently in the introduction, maintained throughout, and elaborated in a nuanced conclusion. Paragraphs are logically balanced with sophisticated vocabulary ("egalitarianism", "regressive", "income-contingent") and complex syntactic range.',
      },
      {
        band: 7,
        essay: `Nowadays, many people argue about whether university should be free for everyone or if students ought to pay their own fees. Both arguments have valid points, and in this essay I will discuss both sides before sharing my perspective.

On the one hand, supporters of free university believe that education is a basic right. If the government pays for tuition, every student will have equal opportunities regardless of their family's wealth. This can help reduce inequality and allow poor students to become doctors, engineers, and teachers. Moreover, a country with more educated workers will have a stronger economy and more technological development. For example, some European countries like Germany offer free higher education and have very productive industries.

On the other hand, others believe that students should pay their own tuition fees. The main reason is that graduates usually earn higher salaries than people with only high school diplomas. Therefore, it seems unfair for normal taxpayers to pay for someone else's expensive degree. In addition, universities need large budgets to maintain modern laboratories and hire skilled professors, which governments might not be able to afford alone.

In conclusion, while free education provides equal opportunities, I believe that students should contribute to their tuition through low-interest student loans. This ensures that universities maintain high educational quality while remaining accessible to everyone.`,
        examinerComment:
          'Band 7.0: Addresses all parts of the task with a clear position throughout. Paragraphs are logically organized with good cohesion and vocabulary. Grammatically accurate with a good range of complex sentences.',
      },
    ],
  },

  // ================= ACADEMIC TASK 1: COMPARATIVE PIE CHARTS =================
  {
    id: 'acad-w-t1-pie',
    examType: 'academic',
    taskType: 'task1',
    title: 'Municipal Water Consumption by Sector (1990 vs 2025)',
    subType: 'pie-chart',
    promptText:
      'The two pie charts compare the proportion of total freshwater consumption across four economic sectors in a rapidly industrialising nation in 1990 and 2025.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
    visualData: {
      type: 'pie',
      dataPoints: {
        title1: 'Water Consumption in 1990',
        segments1: [
          { name: 'Agriculture', percentage: 62, color: '#16a34a' },
          { name: 'Industry', percentage: 18, color: '#2563eb' },
          { name: 'Domestic', percentage: 14, color: '#f59e0b' },
          { name: 'Energy Cooling', percentage: 6, color: '#9333ea' },
        ],
        title2: 'Water Consumption in 2025',
        segments2: [
          { name: 'Agriculture', percentage: 38, color: '#16a34a' },
          { name: 'Industry', percentage: 34, color: '#2563eb' },
          { name: 'Domestic', percentage: 19, color: '#f59e0b' },
          { name: 'Energy Cooling', percentage: 9, color: '#9333ea' },
        ],
      },
      caption: 'Distribution of National Freshwater Withdrawal by Sector (1990 vs 2025)',
    },
    suggestedDurationMinutes: 20,
    minWordCount: 150,
    keyChecklist: [
      'Paraphrase the two pie charts and time years (1990 and 2025) in the introduction',
      'Provide a clear overview: Agriculture remained largest but dropped sharply, while Industry nearly doubled',
      'Use proportional vocabulary: "accounted for", "constituted", "comprised", "almost a fifth"',
      'Compare sectors directly between 1990 and 2025',
    ],
    modelAnswers: [
      {
        band: 9,
        essay: `The two pie charts compare the distribution of national freshwater withdrawals across four distinct sectors—agriculture, industry, domestic households, and energy cooling—in a developing economy between 1990 and 2025.

Overall, the most striking structural shift over the thirty-five-year period was the substantial contraction in agricultural water share, accompanied by a nearly twofold expansion in industrial consumption. Nevertheless, agriculture remained the single largest consumer of freshwater in both surveyed years.

In 1990, irrigation and agricultural activities dominated national water demand, accounting for nearly two-thirds of the total at 62%. By 2025, however, this figure had declined markedly by 24 percentage points to 38%. Conversely, the industrial sector experienced the most pronounced surge: having constituted just under a fifth (18%) of total usage in 1990, industrial demand escalated to 34% in 2025, almost rivalling agriculture.

Meanwhile, the remaining two sectors registered moderate upward growth. Domestic household water consumption rose from 14% in 1990 to nearly one-fifth (19%) by 2025. Similarly, water allocated to thermal energy cooling remained the smallest category in both years, though its share grew by half from 6% to 9% over the period.`,
        examinerComment:
          'Band 9.0: Exemplary synthesis of proportional data. Uses varied fractional expressions ("nearly two-thirds", "just under a fifth", "grew by half") alongside exact percentages.',
      },
    ],
  },

  // ================= GENERAL TRAINING TASK 1: INFORMAL LETTER =================
  {
    id: 'gt-w-t1-informal',
    examType: 'general',
    taskType: 'task1',
    title: 'Informal Letter: Inviting an Overseas Friend to Your Hometown',
    subType: 'letter-informal',
    promptText:
      'An English-speaking friend from abroad is planning to visit your country next month and has written to ask for your advice.\n\nWrite a letter to your friend. In your letter:\n- Express your excitement about their upcoming visit\n- Recommend the best places to visit and local dishes to try\n- Offer to host them at your home for part of their trip\n\nWrite at least 150 words. You do NOT need to write any addresses. Begin your letter with: Dear [Friend\'s First Name],',
    letterContext: {
      recipient: 'Close Overseas Friend (Alex)',
      requiredBulletPoints: [
        'Warm, enthusiastic reaction to their travel news',
        'Specific cultural landmarks and culinary recommendations',
        'Generous offer of accommodation at your apartment',
      ],
    },
    suggestedDurationMinutes: 20,
    minWordCount: 150,
    keyChecklist: [
      'Adopt a warm, natural, conversational register appropriate for a close friend',
      'Address all three bullet points clearly in separate paragraphs',
      'Use natural idiomatic expressions and phrasal verbs appropriately',
      'Close with a warm informal sign-off such as "Best wishes," or "Warm regards,"',
    ],
    modelAnswers: [
      {
        band: 9,
        essay: `Dear Alex,

It was wonderful to hear from you! I am absolutely thrilled that you are finally making the trip over here next month—it feels like ages since we last caught up in person during our university exchange.

Since you will be arriving in mid-autumn, the weather will be crisp and ideal for sightseeing. You definitely cannot miss exploring the historic Old Quarter, where the cobblestone alleys are lined with centuries-old tea houses and artisan workshops. While you are there, make sure to sample our signature braised beef noodle soup and freshly baked sesame pastries from the night market; they are genuinely mouth-watering.

Regarding accommodation, please do not bother booking a hotel for the first week. I have a spacious guest bedroom in my new apartment right near the central metro line, and I would love for you to stay with me. I have already booked a few days of annual leave so I can show you around the coastal cliffs myself.

Let me know your exact flight arrival time as soon as you book your ticket so I can pick you up at the airport!

Best wishes,

Daniel`,
        examinerComment:
          'Band 9.0: Perfectly natural, warm informal tone without slipping into careless slang. Covers all three bullet points thoroughly with engaging vocabulary ("cobblestone alleys", "mouth-watering").',
      },
    ],
  },

  // ================= TASK 2: OPINION ESSAY (AGREE / DISAGREE) =================
  {
    id: 'both-w-t2-opinion',
    examType: 'general',
    taskType: 'task2',
    title: 'Remote Working: Impact on Employee Well-Being and Corporate Productivity',
    subType: 'opinion',
    promptText:
      'Many companies now allow employees to work from home several days a week. Some people claim that remote working improves employee quality of life and productivity, while others believe it weakens team collaboration.\n\nTo what extent do you agree or disagree with this statement? Give reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
    suggestedDurationMinutes: 40,
    minWordCount: 250,
    keyChecklist: [
      'State your degree of agreement clearly in the introductory thesis statement',
      'Develop Body Paragraph 1 around productivity and work-life balance',
      'Develop Body Paragraph 2 addressing collaboration and digital communication tools',
      'Conclude by reinforcing your overarching position clearly',
    ],
    modelAnswers: [
      {
        band: 9,
        essay: `The widespread adoption of flexible telecommuting has fundamentally reshaped modern corporate culture. While critics contend that physical separation erodes workplace synergy, I strongly agree that hybrid remote arrangements substantially enhance both employee well-being and overall organisational output.

First and foremost, eliminating the daily commute yields profound psychological and productivity dividends. In major metropolitan areas, employees routinely spend up to two hours daily navigating congested transit networks, arriving at their desks mentally fatigued. By reclaiming these hours, remote workers experience lower cortisol levels, greater autonomy over their domestic responsibilities, and uninterrupted blocks of deep concentration free from open-plan office distractions. Empirical studies conducted across European technology firms consistently demonstrate that telecommuters complete complex analytical tasks up to 15% faster than their office-bound counterparts.

Admittedly, detractors raise valid concerns regarding spontaneous mentorship and team cohesion. Junior staff members may miss out on informal learning opportunities if isolated permanently at home. However, this limitation is readily mitigated through structured hybrid schedules—where teams convene in person two days per week for strategic brainstorming—supplemented by synchronous cloud collaboration platforms. Thus, remote flexibility need not come at the expense of collective innovation.

In conclusion, the advantages of telecommuting in fostering psychological well-being and focused output far outweigh the manageable challenges of virtual coordination. Organisations that embrace balanced remote policies will undoubtedly attract and retain top-tier talent.`,
        examinerComment:
          'Band 9.0: Clear, authoritative position ("I strongly agree") sustained from introduction to conclusion, with a sophisticated concession paragraph that strengthens the central argument.',
      },
    ],
  },

  // ================= TASK 2: PROBLEM & SOLUTION ESSAY =================
  {
    id: 'both-w-t2-problem-solution',
    examType: 'academic',
    taskType: 'task2',
    title: 'Urban Traffic Congestion: Root Causes and Sustainable Remedies',
    subType: 'problem-solution',
    promptText:
      'In many major cities around the world, traffic congestion has reached critical levels, negatively affecting economic productivity and public health.\n\nWhat are the primary causes of this trend, and what effective measures can governments and urban planners implement to resolve it?\n\nWrite at least 250 words.',
    suggestedDurationMinutes: 40,
    minWordCount: 250,
    keyChecklist: [
      'Paraphrase the problem in the introduction and outline the causes and solutions',
      'Body Paragraph 1: Explain 2 primary causes (urban sprawl, inadequate public transit investment)',
      'Body Paragraph 2: Propose 2 concrete, directly linked solutions (congestion pricing, electrified rail)',
      'Summarize how these combined interventions restore urban mobility',
    ],
    modelAnswers: [
      {
        band: 9,
        essay: `Chronic vehicular gridlock has emerged as a pervasive crisis across modern metropolises, inflicting severe economic losses and respiratory health hazards. This essay will examine the underlying drivers of urban congestion before proposing targeted infrastructure and fiscal remedies.

The proliferation of metropolitan traffic stems primarily from rapid suburban sprawl coupled with chronic underinvestment in public transit. As inner-city housing becomes prohibitively expensive, working populations are forced to relocate to peripheral commuter belts. When these suburbs lack reliable rail connectivity, residents have no viable alternative to private automobile ownership. Furthermore, historical urban planning prioritized highway expansion over multi-modal transit, inadvertently inducing greater vehicular demand.

To alleviate this bottleneck, municipal authorities must implement a dual strategy of fiscal disincentives and public transport modernisation. Firstly, introducing dynamic congestion charging zones—successfully pioneered in cities such as London and Singapore—directly deters non-essential private car journeys during peak hours. Secondly, the revenue generated from these tariffs must be ring-fenced to subsidise high-frequency underground metro networks, dedicated bus rapid transit corridors, and protected cycling infrastructure. When public transit becomes faster and more economical than driving, commuter behaviour shifts organically.

In conclusion, while suburbanisation and car-centric planning have entrenched urban gridlock, governments can decisively reverse this trend by pairing congestion pricing with world-class, affordable public transportation.`,
        examinerComment:
          'Band 9.0: Directly pairs each root cause with a targeted policy remedy. Exceptional lexical precision ("commuter belts", "fiscal disincentives", "ring-fenced").',
      },
    ],
  },

  // ================= ACADEMIC TASK 1: DATA TABLE =================
  {
    id: 'acad-w-t1-table',
    examType: 'academic',
    taskType: 'task1',
    title: 'High-Speed Rail Networks across Five Countries (2024)',
    subType: 'table',
    promptText:
      'The table below gives statistical information about the high-speed rail networks in five different countries in 2024, including total operational track length, annual passenger ridership, and maximum commercial speed.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
    visualData: {
      type: 'table',
      dataPoints: {
        headers: ['Country', 'Operational Track (km)', 'Annual Ridership (Millions)', 'Max Commercial Speed (km/h)', 'Average Ticket Price ($ per 100km)'],
        rows: [
          ['China', '45,000', '2,950', '350', '$8.50'],
          ['Spain', '3,960', '38', '310', '$16.00'],
          ['Japan', '3,145', '355', '320', '$24.50'],
          ['France', '2,800', '122', '320', '$19.20'],
          ['Germany', '1,650', '104', '300', '$21.80'],
        ],
      },
      caption: 'Comparative High-Speed Rail Infrastructure and Utilisation Metrics (2024)',
    },
    suggestedDurationMinutes: 20,
    minWordCount: 150,
    keyChecklist: [
      'Provide a clear overview highlighting that China dominates track length, ridership, and speed while offering the lowest fares',
      'Compare European and Japanese networks: Spain has the longest European track (3,960 km) but the lowest passenger volume (38m)',
      'Contrast Japan’s high passenger density (355m riders on 3,145 km) with its highest ticket cost ($24.50)',
      'Avoid listing every cell mechanically; group by outliers and contrasts',
    ],
    modelAnswers: [
      {
        band: 9,
        essay: `The table compares key infrastructure and operational metrics for high-speed rail (HSR) networks across five nations—namely China, Spain, Japan, France, and Germany—in 2024.

Overall, it is immediately evident that China possesses by far the most extensive and heavily patronised network, coupled with the fastest operating speeds and lowest commuter fares. Equally striking is the disparity between infrastructure scale and passenger volume among the remaining countries, most notably Spain, which ranks second in track mileage yet last in ridership.

Regarding network scale and patronage, China dwarfs all other nations, operating 45,000 kilometres of track—more than eleven times the length of second-placed Spain (3,960 km)—and transporting 2,950 million passengers annually. By contrast, although Japan and France maintain slightly shorter networks of 3,145 km and 2,800 km respectively, they record substantially higher ridership (355 million and 122 million) than Spain, which serves just 38 million commuters. Germany operates the smallest network at 1,650 km, yet still carries 104 million passengers.

In terms of commercial velocity and tariff structures, Chinese trains achieve the highest top speed at 350 km/h while charging the most economical rate of $8.50 per 100 kilometres. Japan and France tie for the second-fastest operations at 320 km/h, slightly ahead of Spain (310 km/h) and Germany (300 km/h). However, Japanese passengers face the steepest fares at $24.50 per 100 km, nearly triple the Chinese tariff, whereas European ticket prices range from $16.00 in Spain to $21.80 in Germany.`,
        examinerComment:
          'Band 9.0: Masterful synthesis of multi-column tabular data. Identifies the inverse relationship between Spain’s track length and passenger ridership rather than mechanically listing figures.',
      },
    ],
  },

  // ================= ACADEMIC TASK 1: MAP TRANSFORMATION =================
  {
    id: 'acad-w-t1-map',
    examType: 'academic',
    taskType: 'task1',
    title: 'Redevelopment of Greenfield Civic Park (1995 vs Present Day)',
    subType: 'map',
    promptText:
      'The plan illustrates the layout of Greenfield Civic Park following its major municipal redevelopment from a traditional garden in 1995 into a modern ecological and recreational precinct today.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
    visualData: {
      type: 'map',
      dataPoints: {},
      caption: 'Greenfield Botanical & Civic Precinct: Current Spatial Layout (Locations A–D)',
    },
    suggestedDurationMinutes: 20,
    minWordCount: 150,
    keyChecklist: [
      'Provide a holistic overview noting the transformation toward family recreation and eco-friendly facilities while preserving natural water features',
      'Use cardinal directions (to the northwest, in the southeastern quadrant, along the eastern bank of Willow River)',
      'Use spatial passive verbs ("was constructed", "has been converted into", "is situated opposite")',
    ],
    modelAnswers: [
      {
        band: 9,
        essay: `The municipal plan illustrates the spatial layout and recreational facilities of Greenfield Civic Park following its modernisation programme.

Overall, the precinct has been thoughtfully organised around a central ornamental fountain and natural water features, balancing botanical conservation in the northern and central zones with family leisure and solar-powered hospitality in the southern quadrants.

Entering through the North Gate, visitors proceed southward along a paved central avenue directly toward a circular courtyard fountain at the heart of the park. Branching westward from the main entrance, a curved gravel path leads to the northwest quadrant, where the Victorian Glasshouse (Location A) is situated.Directly south of the central fountain, opposite the North Gate, lies the Heritage Rose Garden (Location B).

To the east of the central courtyard, Mirror Lake occupies a prominent oval basin, bordered further east by the north-to-south course of Willow River. Whereas the old riverside café in the northeast corner has been permanently closed, a new Solar Pavilion and Tea Room (Location C) has been erected south of Mirror Lake. Finally, a diagonal walkway extends from the central fountain into the southwestern corner, terminating at the Children’s Adventure Playground (Location D).`,
        examinerComment:
          'Band 9.0: Exemplary spatial orientation using cardinal directions, prepositional phrases ("branching westward", "directly south of"), and accurate passive constructions.',
      },
    ],
  },

  // ================= ACADEMIC TASK 1: COMBINED / MULTIPLE CHARTS =================
  {
    id: 'acad-w-t1-combined',
    examType: 'academic',
    taskType: 'task1',
    title: 'Healthcare Expenditure (% of GDP) and Public Health Outcomes (2024)',
    subType: 'combined-chart',
    promptText:
      'The bar chart below shows the percentage of Gross Domestic Product (GDP) spent on healthcare in four countries in 2024, while the accompanying table provides data on average life expectancy and physician density per 1,000 residents.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
    visualData: {
      type: 'combined',
      dataPoints: {
        barSection: {
          title: 'Chart 1: National Healthcare Expenditure as % of GDP (2024)',
          items: [
            { label: 'United States', value: 16.8, unit: '% of GDP', color: '#dc2626' },
            { label: 'Germany', value: 12.7, unit: '% of GDP', color: '#2563eb' },
            { label: 'Japan', value: 11.1, unit: '% of GDP', color: '#16a34a' },
            { label: 'South Korea', value: 9.4, unit: '% of GDP', color: '#9333ea' },
          ],
        },
        tableSection: {
          title: 'Table 1: Life Expectancy and Physician Density (2024)',
          headers: ['Country', 'Average Life Expectancy (Years)', 'Physicians per 1,000 Residents', 'Annual Hospital Visits per Capita'],
          rows: [
            ['United States', '77.5', '2.6', '4.1'],
            ['Germany', '81.2', '4.5', '9.6'],
            ['Japan', '84.7', '2.6', '12.4'],
            ['South Korea', '83.6', '2.5', '14.7'],
          ],
        },
      },
      caption: 'Combined Analysis: Healthcare GDP Allocation vs Longevity and Clinical Access (2024)',
    },
    suggestedDurationMinutes: 20,
    minWordCount: 150,
    keyChecklist: [
      'Introduce both visuals clearly in the opening sentence',
      'Provide a synthesized overview: higher GDP spending does not correlate with longer life expectancy (the US spends the most but has the lowest longevity)',
      'Devote Body Paragraph 1 to the Bar Chart & Life Expectancy contrast',
      'Devote Body Paragraph 2 to Physician Density and Hospital Visit frequency in the Table',
    ],
    modelAnswers: [
      {
        band: 9,
        essay: `The bar chart illustrates the proportion of Gross Domestic Product (GDP) allocated to healthcare across four nations in 2024, while the accompanying table compares their corresponding life expectancy, physician density, and annual per-capita hospital consultations.

Overall, the most striking revelation is the inverse relationship between healthcare expenditure and longevity: although the United States devotes the highest share of GDP to medical services, its citizens record the shortest life expectancy and lowest consultation frequency. Conversely, Japan and South Korea achieve the highest longevity despite considerably lower GDP expenditure.

According to the bar chart, the United States leads healthcare spending at 16.8% of GDP, noticeably surpassing Germany (12.7%), Japan (11.1%), and South Korea (9.4%). Paradoxically, the table reveals that American life expectancy stands at just 77.5 years—more than seven years shorter than in Japan (84.7 years) and six years below South Korea (83.6 years), while Germany occupies an intermediate position at 81.2 years.

Regarding clinical staffing and utilisation, Germany boasts the highest concentration of doctors at 4.5 per 1,000 residents, whereas the US, Japan, and South Korea maintain nearly identical ratios of 2.5 to 2.6 physicians per 1,000 people. Despite similar doctor-to-patient ratios, East Asian citizens attend hospital clinics far more frequently, averaging 14.7 visits annually in South Korea and 12.4 in Japan, compared to just 4.1 visits in the United States.`,
        examinerComment:
          'Band 9.0: Outstanding cross-referencing between the bar chart and table. Synthesizes the paradox between spending and life expectancy in a crystal-clear overview.',
      },
    ],
  },

  // ================= GENERAL TRAINING TASK 1: APOLOGY & EXPLANATION LETTER =================
  {
    id: 'gt-w-t1-apology-explanation',
    examType: 'general',
    taskType: 'task1',
    title: 'Semi-Formal Letter: Apology and Explanation for Missing a Client Presentation',
    subType: 'letter-semi-formal',
    promptText:
      'You were scheduled to co-present an important quarterly project proposal with a senior colleague yesterday, but you were unable to attend due to an unexpected emergency.\n\nWrite a letter to your senior colleague. In your letter:\n- Apologise sincerely for missing the presentation\n- Explain the unexpected circumstances that prevented you from attending\n- Explain how you will follow up with the client to make up for your absence\n\nWrite at least 150 words. You do NOT need to write any addresses. Begin your letter with: Dear [Colleague\'s Name],',
    letterContext: {
      recipient: 'Senior Project Director (Mr. David Sterling)',
      requiredBulletPoints: [
        'Sincere professional apology for missing yesterday’s quarterly briefing',
        'Detailed explanation of the sudden medical or transport emergency',
        'Concrete action plan to brief the client and handle the follow-up Q&A report',
      ],
    },
    suggestedDurationMinutes: 20,
    minWordCount: 150,
    keyChecklist: [
      'Open with a direct, sincere apology in a respectful semi-formal tone',
      'Provide a credible explanation for why you could not notify them beforehand',
      'Propose specific follow-up actions to relieve your colleague’s workload',
      'Close with "Warm regards," or "Yours sincerely,"',
    ],
    modelAnswers: [
      {
        band: 9,
        essay: `Dear David,

Please accept my sincere apologies for failing to attend yesterday morning’s quarterly strategy presentation with the Apex Logistics board, and for being unable to reach you prior to the meeting.

Unfortunately, while driving to the office at 7:45 AM, my car was involved in a multi-vehicle collision on the Westway ring road caused by black ice. Although I escaped with only minor bruising, emergency police cordons closed the highway completely, and my mobile phone battery died while I was providing a witness statement to the traffic officers. By the time I reached a landline at the local medical clinic, our 9:30 AM briefing had already concluded.

I am immensely grateful to you for stepping in to deliver my financial forecasting slides single-handedly. To make amends and ensure the client receives our complete technical analysis, I have already drafted the comprehensive risk-assessment appendix they requested. Furthermore, I have contacted Ms. Elena Rostova at Apex Logistics to schedule a follow-up video briefing this Thursday, which I will lead personally so you can focus on the upcoming Berlin conference.

Once again, I am deeply sorry for placing you in such a difficult position and truly appreciate your understanding.

Yours sincerely,

Hannah Mercer`,
        examinerComment:
          'Band 9.0: Flawless semi-formal workplace register. Balances professional accountability with natural warmth and covers all three bullets with realistic specificity.',
      },
    ],
  },

  // ================= TASK 2: ADVANTAGES & DISADVANTAGES ESSAY =================
  {
    id: 'both-w-t2-advantages',
    examType: 'academic',
    taskType: 'task2',
    title: 'Cashless Digital Societies: Do the Advantages Outweigh the Disadvantages?',
    subType: 'advantage-disadvantage',
    promptText:
      'In many countries, physical cash (coins and banknotes) is rapidly being replaced by digital payment methods such as contactless cards and mobile wallets.\n\nDo the advantages of a cashless society outweigh the disadvantages?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.',
    suggestedDurationMinutes: 40,
    minWordCount: 250,
    keyChecklist: [
      'Explicitly state whether the advantages outweigh the disadvantages in the introduction',
      'Examine the drawbacks (digital exclusion of elderly/unbanked, cybersecurity/privacy risks)',
      'Develop the stronger side in greater depth (transactional efficiency, curbing tax evasion and street crime)',
      'Reiterate your comparative judgment in the conclusion',
    ],
    modelAnswers: [
      {
        band: 9,
        essay: `The rapid transition from physical currency to electronic payment ecosystems has fundamentally transformed modern commerce. While the phasing out of banknotes raises valid concerns regarding digital surveillance and demographic exclusion, I firmly believe that the macroeconomic and security advantages of a largely cashless society substantially outweigh its drawbacks.

Admittedly, a purely digital financial architecture entails notable vulnerabilities. Foremost among these is the risk of marginalising vulnerable segments of the population, particularly elderly citizens and low-income individuals in rural regions who may lack smartphones or high-speed internet connectivity. Furthermore, centralising every commercial transaction on digital servers heightens exposure to systemic cyberattacks, power outages, and intrusive corporate data harvesting, eroding the personal anonymity that physical cash historically guaranteed.

Nevertheless, these challenges are eclipsed by the profound efficiency and transparency dividends generated by electronic transactions. At the microeconomic level, contactless cards and mobile wallets eliminate the friction of handling physical change, accelerating retail checkout times and sparing small businesses the logistical expense of armoured cash transport. More importantly, at the macroeconomic scale, digital audit trails severely curtail the shadow economy. Because electronic transfers leave an immutable record, tax evasion, money laundering, and bribery become exponentially harder to conceal, bolstering public tax revenues in nations such as Sweden and South Korea.

In conclusion, although governments must maintain regulatory safeguards to protect consumer privacy and ensure offline accessibility for senior citizens, the benefits of digital payments in fostering economic transparency and commercial convenience decisively outweigh the disadvantages.`,
        examinerComment:
          'Band 9.0: Directly answers "do the advantages outweigh the disadvantages" using concession-first paragraphing, precise economic lexis ("shadow economy", "immutable record"), and balanced reasoning.',
      },
    ],
  },

  // ================= TASK 2: TWO-PART DIRECT QUESTION ESSAY =================
  {
    id: 'both-w-t2-two-part',
    examType: 'general',
    taskType: 'task2',
    title: 'Declining Print Newspaper Readership: Causes and Societal Impact',
    subType: 'two-part',
    promptText:
      'Fewer and fewer young people today read printed newspapers or watch scheduled television news broadcasts, relying instead on social media feeds for current affairs.\n\nWhy is this shift occurring, and do you think it is a positive or negative development?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.',
    suggestedDurationMinutes: 40,
    minWordCount: 250,
    keyChecklist: [
      'Address BOTH questions explicitly in your introduction',
      'Body Paragraph 1: Answer Question 1 (Why is this occurring? Instant mobile access, interactive short-form formats, zero subscription cost)',
      'Body Paragraph 2: Answer Question 2 (Is it positive or negative? Largely negative due to algorithmic echo chambers and unverified misinformation)',
      'Summarize both answers cohesively in the conclusion',
    ],
    modelAnswers: [
      {
        band: 9,
        essay: `The traditional habit of reading daily print newspapers or tuning into scheduled evening broadcasts has declined precipitously among younger generations, who increasingly consume news via social media algorithms. This essay will explore the technological and lifestyle factors driving this migration before arguing that it represents a predominantly negative development for civic literacy.

The primary catalyst behind youth abandonment of legacy media is the demand for instantaneous, on-demand convenience. Unlike printed broadsheets—which report yesterday’s events at a financial cost—platforms such as X, Instagram, and TikTok deliver real-time global updates free of charge directly to smartphones. Furthermore, digital natives gravitate toward concise, visually engaging multimedia formats and interactive comment threads rather than passive, thirty-minute television bulletins scheduled at fixed hours.

Despite the undeniable speed of social media news, I contend that this transition is largely detrimental to informed democratic citizenship. Traditional journalism is governed by editorial fact-checking, legal accountability, and investigative depth. By contrast, social media platforms prioritise engagement metrics over veracity, frequently amplifying sensationalised clickbait and fabricated misinformation. Moreover, personalized recommendation algorithms trap young readers inside ideological echo chambers, exposing them only to viewpoints that reinforce their pre-existing biases while eroding their capacity for critical analysis.

In conclusion, while the convenience and immediacy of mobile platforms explain why young people have turned away from print and broadcast journalism, the resulting proliferation of unverified news and algorithmic polarisation makes this a troubling societal trend.`,
        examinerComment:
          'Band 9.0: Gives equal, rigorous analytical weight to both questions in the prompt. Seamless transitions and sophisticated vocabulary ("precipitously", "veracity", "ideological echo chambers").',
      },
    ],
  },
];

