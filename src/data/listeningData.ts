import { ListeningTest } from '../types/ielts';

export const IELTS_LISTENING_CONVERSION_TABLE: { [raw: number]: number } = {
  40: 9.0, 39: 9.0,
  38: 8.5, 37: 8.5,
  36: 8.0, 35: 8.0,
  34: 7.5, 33: 7.5, 32: 7.5,
  31: 7.0, 30: 7.0,
  29: 6.5, 28: 6.5, 27: 6.5, 26: 6.5,
  25: 6.0, 24: 6.0, 23: 6.0,
  22: 5.5, 21: 5.5, 20: 5.5, 19: 5.5, 18: 5.5,
  17: 5.0, 16: 5.0,
  15: 4.5, 14: 4.5, 13: 4.5,
  12: 4.0, 11: 4.0, 10: 4.0,
};

export function calculateListeningBand(correctCount: number, totalQuestions: number = 40): number {
  const scaledRaw = Math.round((correctCount / Math.max(totalQuestions, 1)) * 40);
  const clamped = Math.min(40, Math.max(10, scaledRaw));
  return IELTS_LISTENING_CONVERSION_TABLE[clamped] || (clamped >= 35 ? 8.0 : clamped >= 27 ? 6.5 : 5.0);
}

export const LISTENING_TESTS: ListeningTest[] = [
  {
    id: 'listen-full-test-1',
    title: 'IELTS Listening Practice Test 1: Campus Life, Botanical Orientation & Neuro-Architecture (40 Questions)',
    description: 'Complete 4-section, 40-question IELTS Listening examination featuring British, Australian, and American speakers across social and academic contexts.',
    audioDurationSeconds: 1800,
    sections: [
      // ==================== SECTION 1 (Questions 1–10) ====================
      {
        sectionNumber: 1,
        contextTitle: 'Section 1 (Q1–10): University Student Accommodation Office Enquiry',
        accent: 'British',
        speakers: ['Housing Officer (Mrs. Davis)', 'Student (Liam)'],
        scriptText:
          "Good morning. Welcome to the Student Housing Office. How can I help you today?\n" +
          "Liam: Hello. I'm arriving for the autumn semester to begin my master's degree in marine biology, and I need to register for university accommodation.\n" +
          "Housing Officer: Certainly, Liam. First, let me take down some personal details. What is your full surname?\n" +
          "Liam: It's MacIntyre. That's M-A-C-I-N-T-Y-R-E.\n" +
          "Housing Officer: Thank you. And your student identification number?\n" +
          "Liam: It's K-B-9-0-4-3-1.\n" +
          "Housing Officer: Got it. And what is your current home postcode so we can send the tenancy contract?\n" +
          "Liam: My postcode is G-L-5-2, 8-R-T.\n" +
          "Housing Officer: Lovely. Now, what type of room preference do you have? We offer standard single rooms with shared bathroom facilities, or self-contained studio en-suite flats.\n" +
          "Liam: I would strongly prefer the self-contained en-suite flat, as I often study late into the night.\n" +
          "Housing Officer: Right. And what is your maximum weekly budget for rent, including utility bills?\n" +
          "Liam: I initially budgeted 160 pounds, but my parents agreed to help, so my maximum ceiling is 185 pounds per week.\n" +
          "Housing Officer: Excellent. We have a placement in Bramley Court which is 175 pounds per week, and it includes complimentary access to the campus gymnasium. You also need to pay a refundable security deposit of 250 pounds.\n" +
          "Liam: That's reasonable. Do I have to bring my own kitchen equipment?\n" +
          "Housing Officer: Pots and plates are provided, though residents must bring their own bedding. Also, please let me know if you have any dietary requirements for the welcome banquet.\n" +
          "Liam: Yes, I have a severe allergy to shellfish, so I avoid all seafood.\n" +
          "Housing Officer: Noted: shellfish allergy. Finally, moving-in day is scheduled for September 24th, and you can collect your electronic keycard from the South Reception desk.\n" +
          "Liam: September 24th sounds perfect. Thank you so much!",
        questions: [
          {
            id: 'l1-q1',
            section: 1,
            type: 'form-completion',
            prompt: 'Q1. Student Surname (Write ONE WORD): ________',
            correctAnswer: 'MacIntyre',
            explanation: 'Liam spells his surname explicitly: M-A-C-I-N-T-Y-R-E.',
          },
          {
            id: 'l1-q2',
            section: 1,
            type: 'form-completion',
            prompt: 'Q2. Student ID Number: ________',
            correctAnswer: 'KB90431',
            explanation: 'Liam states his student identification number is KB90431.',
          },
          {
            id: 'l1-q3',
            section: 1,
            type: 'form-completion',
            prompt: 'Q3. Home Postcode for Contract Delivery: ________',
            correctAnswer: 'GL52 8RT',
            explanation: 'Liam dictates his postcode as G-L-5-2, 8-R-T.',
          },
          {
            id: 'l1-q4',
            section: 1,
            type: 'multiple-choice',
            prompt: 'Q4. What accommodation type did Liam choose?',
            options: [
              'Standard single with shared kitchen',
              'Self-contained studio en-suite flat',
              'Shared twin room near the library',
              'Private off-campus homestay',
            ],
            correctAnswer: 'Self-contained studio en-suite flat',
            explanation: 'Liam says: "I would strongly prefer the self-contained en-suite flat, as I often study late into the night."',
          },
          {
            id: 'l1-q5',
            section: 1,
            type: 'form-completion',
            prompt: 'Q5. Liam\'s maximum weekly rent budget (after parental support): £________',
            correctAnswer: '185',
            explanation: '160 pounds is a past distractor ("initially budgeted"); his actual maximum ceiling is 185 pounds.',
          },
          {
            id: 'l1-q6',
            section: 1,
            type: 'short-answer',
            prompt: 'Q6. Actual weekly rental price for the room in Bramley Court: £________',
            correctAnswer: '175',
            explanation: 'The housing officer confirms: "Bramley Court which is 175 pounds per week."',
          },
          {
            id: 'l1-q7',
            section: 1,
            type: 'form-completion',
            prompt: 'Q7. Free facility included with Bramley Court rent: complimentary access to the campus ________ (ONE WORD).',
            correctAnswer: 'gymnasium',
            explanation: 'The rent includes complimentary access to the campus gymnasium.',
          },
          {
            id: 'l1-q8',
            section: 1,
            type: 'form-completion',
            prompt: 'Q8. Refundable security deposit required: £________',
            correctAnswer: '250',
            explanation: 'The officer states: "a refundable security deposit of 250 pounds."',
          },
          {
            id: 'l1-q9',
            section: 1,
            type: 'note-completion',
            prompt: 'Q9. Item residents must bring themselves (ONE WORD): ________',
            correctAnswer: 'bedding',
            explanation: 'Pots and plates are provided, "though residents must bring their own bedding."',
          },
          {
            id: 'l1-q10',
            section: 1,
            type: 'form-completion',
            prompt: 'Q10. Food allergy noted for the welcome banquet (ONE WORD): ________',
            correctAnswer: 'shellfish',
            explanation: 'Liam specifies a severe allergy to shellfish.',
          },
        ],
      },

      // ==================== SECTION 2 (Questions 11–20) ====================
      {
        sectionNumber: 2,
        contextTitle: 'Section 2 (Q11–20): Orientation Guide to Greenfield Botanical Park',
        accent: 'British',
        speakers: ['Park Curator (Alan Bennett)'],
        scriptText:
          "Welcome to Greenfield Botanical Park, everyone! Before we embark on our walking tour, let me direct your attention to the visitors map here at the North Gate entrance.\n" +
          "Directly opposite the North Gate, right across the central courtyard fountain, you will see the Heritage Rose Garden, which was planted in 1892. If you turn immediately left from the North Gate along the gravel pathway, you will find the Victorian Glasshouse, which houses rare tropical orchids.\n" +
          "Now, for refreshments, do not go to the old café near the river—it is under renovation until November. Instead, follow the eastern path past the swan lake until you reach the Solar Pavilion; that is where our organic tea room and gift shop are situated. Finally, the children's adventure playground is located in the far southwestern corner, completely enclosed by cedar fencing for safety.\n" +
          "For those interested in wildlife, our guided birdwatching walks commence daily at 10:30 AM from the Solar Pavilion. Tickets for the subterranean fern grotto cost 6 pounds for adults, though entry is completely free for children under twelve. Please remember that cycling and feeding the waterfowl are strictly prohibited inside the park grounds, and our main gates lock promptly at 6:00 PM.",
        questions: [
          {
            id: 'l2-q1',
            section: 2,
            type: 'map-labelling',
            prompt: 'Q11. Map Location A (Immediately to the left of the North Gate along the gravel pathway):',
            options: [
              'Heritage Rose Garden',
              'Victorian Glasshouse',
              'Solar Pavilion',
              'Children’s Playground',
            ],
            correctAnswer: 'Victorian Glasshouse',
            explanation: 'The curator states: "turn immediately left from the North Gate along the gravel pathway, you will find the Victorian Glasshouse."',
          },
          {
            id: 'l2-q2',
            section: 2,
            type: 'map-labelling',
            prompt: 'Q12. Map Location B (Directly opposite the North Gate across the central courtyard fountain):',
            options: [
              'Heritage Rose Garden',
              'Victorian Glasshouse',
              'Solar Pavilion',
              'Old River Café',
            ],
            correctAnswer: 'Heritage Rose Garden',
            explanation: 'Directly opposite the North Gate across the fountain is the Heritage Rose Garden.',
          },
          {
            id: 'l2-q3',
            section: 2,
            type: 'multiple-choice',
            prompt: 'Q13. Where are visitors advised to purchase refreshments today?',
            options: [
              'The Old Café by the river',
              'The Solar Pavilion tea room',
              'The North Gate kiosk',
              'The Children’s Playground canteen',
            ],
            correctAnswer: 'The Solar Pavilion tea room',
            explanation: 'The old café is closed for renovation; refreshments are served at the Solar Pavilion.',
          },
          {
            id: 'l2-q4',
            section: 2,
            type: 'map-labelling',
            prompt: 'Q14. Map Location D (In the far southwestern corner enclosed by cedar fencing):',
            options: [
              'Swan Lake',
              'Children’s Adventure Playground',
              'Fern Grotto',
              'Visitor Car Park',
            ],
            correctAnswer: 'Children’s Adventure Playground',
            explanation: 'The children\'s adventure playground is in the far southwestern corner.',
          },
          {
            id: 'l2-q5',
            section: 2,
            type: 'short-answer',
            prompt: 'Q15. In which year was the Heritage Rose Garden originally planted? ________',
            correctAnswer: '1892',
            explanation: 'The curator notes the Heritage Rose Garden was planted in 1892.',
          },
          {
            id: 'l2-q6',
            section: 2,
            type: 'note-completion',
            prompt: 'Q16. The Victorian Glasshouse contains rare tropical ________ (ONE WORD).',
            correctAnswer: 'orchids',
            explanation: 'The glasshouse "houses rare tropical orchids".',
          },
          {
            id: 'l2-q7',
            section: 2,
            type: 'short-answer',
            prompt: 'Q17. At what time does the daily birdwatching walk begin? ________ AM',
            correctAnswer: '10:30',
            explanation: 'Guided birdwatching walks commence daily at 10:30 AM.',
          },
          {
            id: 'l2-q8',
            section: 2,
            type: 'short-answer',
            prompt: 'Q18. Adult ticket price for the subterranean fern grotto: £________',
            correctAnswer: '6',
            explanation: 'Tickets for the fern grotto cost 6 pounds for adults.',
          },
          {
            id: 'l2-q9',
            section: 2,
            type: 'sentence-completion',
            prompt: 'Q19. Visitors are strictly prohibited from cycling or feeding the ________ (ONE WORD).',
            correctAnswer: 'waterfowl',
            explanation: 'Cycling and feeding the waterfowl are strictly prohibited.',
          },
          {
            id: 'l2-q10',
            section: 2,
            type: 'short-answer',
            prompt: 'Q20. At what time do the main park gates lock in the evening? ________ PM',
            correctAnswer: '6:00',
            explanation: 'The main gates lock promptly at 6:00 PM.',
          },
        ],
      },

      // ==================== SECTION 3 (Questions 21–30) ====================
      {
        sectionNumber: 3,
        contextTitle: 'Section 3 (Q21–30): Environmental Science Students Planning Estuary Fieldwork',
        accent: 'Australian',
        speakers: ['Chloe (Student)', 'Jack (Student)', 'Tutor Dr. Evans'],
        scriptText:
          "Dr. Evans: Welcome, Chloe and Jack. Have you finalized the sampling methodology for your mangrove ecosystem investigation?\n" +
          "Jack: Yes, Dr. Evans. We initially considered doing random quadrat sampling across the entire estuary, but after inspecting the tidal charts, we realised the incoming tide would make eastern transects inaccessible in the afternoon.\n" +
          "Chloe: So we've chosen stratified systematic sampling instead. We will establish five fixed transect lines perpendicular to the shoreline at 50-meter intervals.\n" +
          "Dr. Evans: That is much more scientifically rigorous. What instruments will you utilize to assess water salinity and dissolved oxygen?\n" +
          "Jack: We booked the digital multiparameter probe from the marine biology store. However, we still need calibration buffers for the pH sensor.\n" +
          "Dr. Evans: I can authorize those from lab B2 today. Make sure to record water temperature simultaneously, as dissolved oxygen saturation is inversely proportional to temperature.\n" +
          "Chloe: We also need to collect sediment cores to measure heavy metal accumulation—specifically lead and cadmium from historical shipping activity.\n" +
          "Dr. Evans: Good point. Use polyvinyl coring tubes rather than steel ones so the metal tube doesn't contaminate your soil samples. How many sediment samples do you plan to extract?\n" +
          "Jack: Twenty-five in total—five along each transect. We will freeze them at minus twenty degrees Celsius before running atomic absorption spectroscopy next Tuesday.\n" +
          "Dr. Evans: Excellent. Remember that your interim literature review is due on November 14th, and it must cite at least twelve peer-reviewed journal articles.",
        questions: [
          {
            id: 'l3-q1',
            section: 3,
            type: 'multiple-choice',
            prompt: 'Q21. Why did the students reject random quadrat sampling?',
            options: [
              'The equipment was too heavy to transport.',
              'Tidal conditions would cut off access to eastern sections.',
              'The department tutor disallowed random methodologies.',
              'The mangrove trees were too dense for quadrats.',
            ],
            correctAnswer: 'Tidal conditions would cut off access to eastern sections.',
            explanation: 'Jack states that inspecting the tidal charts revealed the incoming tide made eastern transects inaccessible in the afternoon.',
          },
          {
            id: 'l3-q2',
            section: 3,
            type: 'table-completion',
            prompt: 'Q22. Sampling technique chosen: ________ systematic sampling (ONE WORD).',
            correctAnswer: 'stratified',
            explanation: 'Chloe says: "So we\'ve chosen stratified systematic sampling instead."',
          },
          {
            id: 'l3-q3',
            section: 3,
            type: 'note-completion',
            prompt: 'Q23. Distance between the five fixed transect lines: ________ meters.',
            correctAnswer: '50',
            explanation: 'Chloe specifies five fixed transect lines at 50-meter intervals.',
          },
          {
            id: 'l3-q4',
            section: 3,
            type: 'note-completion',
            prompt: 'Q24. Item still needed for the pH sensor: calibration ________ (ONE WORD).',
            correctAnswer: 'buffers',
            explanation: 'Jack notes: "we still need calibration buffers for the pH sensor."',
          },
          {
            id: 'l3-q5',
            section: 3,
            type: 'sentence-completion',
            prompt: 'Q25. Dr. Evans reminds students that dissolved oxygen saturation is inversely proportional to ________ (ONE WORD).',
            correctAnswer: 'temperature',
            explanation: 'Dr. Evans warns: "dissolved oxygen saturation is inversely proportional to temperature."',
          },
          {
            id: 'l3-q6',
            section: 3,
            type: 'note-completion',
            prompt: 'Q26. Sediment cores will be analysed for heavy metals caused by historical ________ activity (ONE WORD).',
            correctAnswer: 'shipping',
            explanation: 'Chloe mentions measuring lead and cadmium from historical shipping activity.',
          },
          {
            id: 'l3-q7',
            section: 3,
            type: 'multiple-choice',
            prompt: 'Q27. Why does Dr. Evans recommend polyvinyl coring tubes instead of steel tubes?',
            options: [
              'They are lighter to carry in the mud.',
              'To prevent metallic contamination of the sediment samples.',
              'Steel tubes are currently out of stock.',
              'Polyvinyl tubes are transparent.',
            ],
            correctAnswer: 'To prevent metallic contamination of the sediment samples.',
            explanation: 'Dr. Evans advises polyvinyl tubes "so the metal tube doesn\'t contaminate your soil samples."',
          },
          {
            id: 'l3-q8',
            section: 3,
            type: 'short-answer',
            prompt: 'Q28. Total number of sediment samples to be extracted across all transects: ________',
            correctAnswer: '25',
            explanation: 'Jack states: "Twenty-five in total—five along each transect." (25 or twenty-five).',
          },
          {
            id: 'l3-q9',
            section: 3,
            type: 'note-completion',
            prompt: 'Q29. Submission deadline for the interim literature review: November ________.',
            correctAnswer: '14th',
            explanation: 'Dr. Evans states the literature review is due on November 14th.',
          },
          {
            id: 'l3-q10',
            section: 3,
            type: 'short-answer',
            prompt: 'Q30. Minimum number of peer-reviewed journal articles required in the review: ________',
            correctAnswer: '12',
            explanation: 'The review must cite at least twelve (12) peer-reviewed journal articles.',
          },
        ],
      },

      // ==================== SECTION 4 (Questions 31–40) ====================
      {
        sectionNumber: 4,
        contextTitle: 'Section 4 (Q31–40): University Lecture on Neuro-Architecture & Biophilic Design',
        accent: 'British',
        speakers: ['Professor Angela Thorne'],
        scriptText:
          "Good afternoon, ladies and gentlemen. Today we explore the burgeoning interdisciplinary field of neuro-architecture—the study of how built environments fundamentally modulate human neural circuitry, stress biomarkers, and cognitive output.\n" +
          "Historically, architectural theory focused almost exclusively on aesthetics and structural mechanics. However, contemporary functional magnetic resonance imaging, or fMRI, has demonstrated that interior spatial geometry triggers instantaneous endocrine responses. Specifically, exposure to high ceilings above three meters consistently activates brain networks associated with abstract, relational thinking. Conversely, lower ceilings stimulate concrete, detail-oriented task execution such as proofreading or bookkeeping.\n" +
          "Furthermore, the integration of biophilic elements—such as natural diurnal daylight cycles and fractal geometry found in natural foliage—induces a 23 percent reduction in circulating salivary cortisol within corporate office environments. In urban hospitals, post-surgical patients with views overlooking deciduous trees recovered 18 percent faster and requested significantly less pain medication than counterparts whose windows faced brick facades.\n" +
          "Acoustic architecture is equally critical. Open-plan offices plagued by reverberant background speech impair episodic memory recall by up to 15 percent. By installing porous timber baffles and acoustic mycelium panels, architects can absorb mid-frequency vocal chatter while preserving spatial openness. Finally, circadian lighting systems that shift from blue-enriched morning wavelengths to warm amber evening tones have been shown to improve nocturnal melatonin secretion among shift workers.",
        questions: [
          {
            id: 'l4-q1',
            section: 4,
            type: 'note-completion',
            prompt: 'Q31. Historically, architecture focused primarily on structural mechanics and ________ (ONE WORD).',
            correctAnswer: 'aesthetics',
            explanation: 'The lecturer notes: "Historically, architectural theory focused almost exclusively on aesthetics and structural mechanics."',
          },
          {
            id: 'l4-q2',
            section: 4,
            type: 'multiple-choice',
            prompt: 'Q32. According to fMRI research, what cognitive impact do ceilings over three meters high produce?',
            options: [
              'They increase computational speed on numeric tasks.',
              'They activate brain networks associated with abstract, relational thinking.',
              'They induce chronic drowsiness and eye strain.',
              'They diminish short-term spatial orientation.',
            ],
            correctAnswer: 'They activate brain networks associated with abstract, relational thinking.',
            explanation: 'Professor Thorne specifies that high ceilings stimulate abstract, relational cognitive processes.',
          },
          {
            id: 'l4-q3',
            section: 4,
            type: 'note-completion',
            prompt: 'Q33. Lower ceilings are better suited for detail-oriented tasks such as bookkeeping or ________ (ONE WORD).',
            correctAnswer: 'proofreading',
            explanation: 'Lower ceilings stimulate detail-oriented task execution "such as proofreading or bookkeeping".',
          },
          {
            id: 'l4-q4',
            section: 4,
            type: 'note-completion',
            prompt: 'Q34. Biophilic elements in offices resulted in a ________ percent reduction in salivary cortisol.',
            correctAnswer: '23',
            explanation: 'The lecture highlights a 23 percent drop in salivary cortisol.',
          },
          {
            id: 'l4-q5',
            section: 4,
            type: 'sentence-completion',
            prompt: 'Q35. Hospital patients who recovered 18 percent faster had windows looking onto ________ trees (ONE WORD).',
            correctAnswer: 'deciduous',
            explanation: 'The professor cites patients with views overlooking deciduous trees.',
          },
          {
            id: 'l4-q6',
            section: 4,
            type: 'note-completion',
            prompt: 'Q36. Patients with nature views also required less ________ medication (ONE WORD).',
            correctAnswer: 'pain',
            explanation: 'They "requested significantly less pain medication".',
          },
          {
            id: 'l4-q7',
            section: 4,
            type: 'note-completion',
            prompt: 'Q37. Uncontrolled background speech in open-plan offices reduces episodic ________ recall by 15% (ONE WORD).',
            correctAnswer: 'memory',
            explanation: 'Reverberant background speech impairs "episodic memory recall by up to 15 percent".',
          },
          {
            id: 'l4-q8',
            section: 4,
            type: 'note-completion',
            prompt: 'Q38. Architects absorb vocal chatter by installing porous ________ baffles (ONE WORD).',
            correctAnswer: 'timber',
            explanation: 'The lecture mentions "installing porous timber baffles and acoustic mycelium panels".',
          },
          {
            id: 'l4-q9',
            section: 4,
            type: 'note-completion',
            prompt: 'Q39. Circadian lighting shifts from blue-enriched morning light to warm ________ evening tones (ONE WORD).',
            correctAnswer: 'amber',
            explanation: 'The lighting shifts "to warm amber evening tones".',
          },
          {
            id: 'l4-q10',
            section: 4,
            type: 'sentence-completion',
            prompt: 'Q40. Circadian lighting systems improve nocturnal ________ secretion among shift workers (ONE WORD).',
            correctAnswer: 'melatonin',
            explanation: 'They "improve nocturnal melatonin secretion among shift workers".',
          },
        ],
      },
    ],
  },
];
