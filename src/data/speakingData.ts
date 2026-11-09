import { SpeakingPromptPack } from '../types/ielts';

export const SPEAKING_PROMPT_PACKS: SpeakingPromptPack[] = [
  {
    id: 'spk-pack-1',
    title: 'Pack 1: Technology, Artificial Intelligence & Modern Decisions',
    topic: 'Technology and Everyday Decisions',
    part1: {
      questions: [
        {
          id: 'spk-p1-q1',
          question: 'Do you work or are you a student?',
          modelAnswerBand8:
            'At present, I am an undergraduate student majoring in software engineering at the local university. I thoroughly enjoy delving into algorithms and system design, although balancing coursework with project deadlines can be quite demanding at times.',
          tips: 'Answer directly, add 1-2 developing clauses explaining your feeling or details, and avoid robotic one-word replies.',
        },
        {
          id: 'spk-p1-q2',
          question: 'What kind of technology do you use most frequently in your daily life?',
          modelAnswerBand8:
            'Undoubtedly, my laptop and smartphone are indispensable tools. I rely predominantly on cloud computing platforms for academic collaboration, as well as digital note-taking applications which keep my daily schedule meticulously organized.',
          tips: 'Use academic adverbs like "predominantly" and "undoubtedly", and mention specific functional uses.',
        },
        {
          id: 'spk-p1-q3',
          question: 'Do you prefer sending text messages or making phone calls?',
          modelAnswerBand8:
            'It largely depends on the context. For concise logistical updates, instant messaging is vastly superior due to its convenience. However, if I need to address complex emotional matters or delicate work issues, I invariably opt for a direct phone call to ensure clear nuance.',
          tips: 'Demonstrate flexibility with conditional phrases ("It largely depends on...").',
        },
      ],
    },
    part2CueCard: {
      topic: 'Describe an important piece of technology you purchased that made your life significantly easier.',
      bullets: [
        'What the item was and when you acquired it',
        'What specific features made it appealing to you',
        'How often you use it in your weekly routine',
        'And explain why this piece of technology has made your life significantly easier',
      ],
      prepTimeSeconds: 60,
      speakTimeSeconds: 120,
      keyVocabulary: [
        'indispensable', 'exponentially streamlined', 'state-of-the-art', 'ergonomic design',
        'seamless integration', 'boosted my productivity', 'worth every penny', 'user-friendly interface'
      ],
      modelAnswerBand8:
        'I would like to talk about an active noise-cancelling headset that I invested in roughly six months ago, just prior to beginning my final year dissertation.\n\n' +
        'Living in a bustling metropolitan area, background noise from traffic and commuter bustle frequently disrupted my concentration. What stood out to me when researching this particular model was its hybrid acoustic cancellation algorithms and exceptionally lightweight ergonomic design.\n\n' +
        'In terms of my weekly routine, I use it almost continuously—whether studying in crowded campus libraries, commuting on trains, or joining remote seminars. It effectively creates a sanctuary of total silence wherever I am.\n\n' +
        'Overall, it has made my life significantly easier because it has exponentially boosted my sustained productivity. I am able to read dense academic journals for hours on end without sensory fatigue, making it one of the most rewarding investments I have ever made.',
    },
    part3Discussion: {
      questions: [
        {
          id: 'spk-p3-q1',
          question: 'In what ways has artificial intelligence altered the modern workforce?',
          followUpContext: 'Automation, job displacement versus new tech roles, productivity gains.',
          modelAnswerBand8:
            'From my perspective, artificial intelligence is instigating a profound paradigm shift across numerous industrial sectors. On the one hand, routine algorithmic automation is displacing administrative and clerical roles. On the other hand, it liberates human professionals to focus on creative synthesis, strategic governance, and empathetic decision-making. Therefore, proactive workforce upskilling will be paramount for governments worldwide.',
          collocations: ['paradigm shift', 'algorithmic automation', 'proactive workforce upskilling', 'empathetic decision-making'],
        },
        {
          id: 'spk-p3-q2',
          question: 'Do you believe people have become overly dependent on digital devices today?',
          followUpContext: 'Cognitive offloading, memory retention, loss of social skills.',
          modelAnswerBand8:
            'I would largely concur with that assessment. Many individuals engage in cognitive offloading—relying on navigation apps for basic spatial orientation and search engines for memorizing factual knowledge. While this certainly enhances momentary convenience, research suggests it may attenuate our innate problem-solving faculties and short-term working memory capacity.',
          collocations: ['cognitive offloading', 'spatial orientation', 'attenuate innate faculties', 'working memory capacity'],
        },
        {
          id: 'spk-p3-q3',
          question: 'How might technological advancements impact education in the coming decades?',
          followUpContext: 'Immersive virtual classrooms, AI tutors, equal access vs digital divide.',
          modelAnswerBand8:
            'I foresee a future where hyper-personalized adaptive learning algorithms become standard pedagogical practice. Rather than a one-size-fits-all curriculum, AI tutors will dynamically calibrate the pace and depth of instruction to each student\'s cognitive profile. However, ensuring equitable access to these high-end tools across developing nations will remain a formidable challenge.',
          collocations: ['hyper-personalized learning', 'pedagogical practice', 'dynamically calibrate', 'formidable challenge'],
        },
      ],
    },
  },
  {
    id: 'spk-pack-2',
    title: 'Pack 2: Environment, Cities & Sustainability',
    topic: 'Urban Environment and Green Living',
    part1: {
      questions: [
        {
          id: 'spk-p1-b1',
          question: 'Are there many parks or green spaces where you live?',
          modelAnswerBand8:
            'Yes, quite fortunately my neighborhood is peppered with municipal parks and botanical gardens. In fact, there is a serene nature reserve within a ten-minute stroll from my apartment, which provides an idyllic retreat from city traffic.',
          tips: 'Use sensory vocabulary like "peppered with", "serene", and "idyllic retreat".',
        },
        {
          id: 'spk-p1-b2',
          question: 'What do you do to help protect the environment?',
          modelAnswerBand8:
            'I make a conscious effort to adhere to sustainable habits, such as segregating domestic recyclables, minimising single-use plastics, and relying primarily on public transit or cycling for my daily commute.',
          tips: 'Group your habits logically and employ specific phrases like "segregating recyclables".',
        },
      ],
    },
    part2CueCard: {
      topic: 'Describe a city or town you visited that you found remarkably pleasant and livable.',
      bullets: [
        'Where this place is located and when you travelled there',
        'What the architecture and natural surroundings were like',
        'What activities people can enjoy in this city',
        'And explain why you considered this place so remarkably pleasant to live in',
      ],
      prepTimeSeconds: 60,
      speakTimeSeconds: 120,
      keyVocabulary: [
        'picturesque', 'pedestrianized boulevards', 'harmonious blend', 'green urban planning',
        'unhurried pace of life', 'vibrant cultural tapestry', 'pristine cleanliness'
      ],
      modelAnswerBand8:
        'A place that left an indelible impression on me is the coastal city of San Sebastian in northern Spain, which I had the pleasure of visiting during the late summer of last year.\n\n' +
        'What captivated me immediately was the harmonious blend of historic Belle Époque architecture alongside the dramatic curve of La Concha bay. Unlike many frantic metropolises, San Sebastian prioritizes green urban planning, with extensive pedestrianized boulevards and dedicated bicycle corridors.\n\n' +
        'Residents and visitors alike can indulge in world-renowned culinary traditions, stroll along the promenade, or surf the Atlantic waves directly adjacent to the historic town center.\n\n' +
        'I found it extraordinarily livable because of the palpable sense of community and the unhurried pace of life. Clean air, abundant public amenities, and safety make it an exemplary benchmark for sustainable 21st-century urbanism.',
    },
    part3Discussion: {
      questions: [
        {
          id: 'spk-p3-b1',
          question: 'What measures should municipal planners adopt to make modern cities more environmentally friendly?',
          followUpContext: 'Electrification of transit, vertical gardens, pedestrian zones.',
          modelAnswerBand8:
            'First and foremost, urban planners ought to incentivize carbon-neutral public transport and establish extensive pedestrian-only zones in central districts. Furthermore, mandating green roofs and incorporating permeable pavements can substantially counteract the urban heat island effect while improving storm-water runoff management.',
          collocations: ['carbon-neutral transit', 'urban heat island effect', 'permeable pavements', 'green urban planning'],
        },
      ],
    },
  },
];
