import tool1Logo from '../../assets/images/tool 1 logo.png'
import tool2Logo from '../../assets/images/tool 2 logo.png'
import tool3Logo from '../../assets/images/tool 3 logo.png'
import tool4Logo from '../../assets/images/tool 4 logo.png'
import tool5Logo from '../../assets/images/tool 5 logo.png'
import tool6Logo from '../../assets/images/tool 6 logo (pro tool).png'

export const allTools = [
  {
    id: 'unit-conversion',
    name: 'Engineering Units Converter',
    desc: 'Convert between 150+ engineering units instantly. Covers pressure, flow, temperature, length, mass, and more.',
    file: '/tools/tool1.html',
    badge: 'free',
    icon: 'unit',
    logo: tool1Logo,
  },
  {
    id: 'flow-rate',
    name: 'Kv / Flow Rate Calculator',
    desc: 'Calculate liquid, gas and steam flow rates with accuracy. Determine Kv / Cv values for valve sizing.',
    file: '/tools/tool2.html',
    badge: 'free',
    icon: 'flow',
    logo: tool2Logo,
  },
  {
    id: 'valve-torque',
    name: 'Valve Torque Calculator',
    desc: 'Size control, safety, check, ball and butterfly valves. Calculate required actuator torque.',
    file: '/tools/tool3.html',
    badge: 'free',
    icon: 'valve',
    logo: tool3Logo,
  },
  {
    id: 'actuator-sizing',
    name: 'Actuator / Valve Match',
    desc: 'Select and size the right actuator for your valve. Match pneumatic actuators to valve torque requirements.',
    file: '/tools/tool4.html',
    badge: 'free',
    icon: 'actuator',
    logo: tool6Logo,
  },
  {
    id: 'actuator-cross-reference',
    name: 'Actuator Cross Reference',
    desc: 'Cross-reference actuator models across manufacturers. Find compatible replacements instantly.',
    file: '/tools/tool5.html',
    badge: 'paid',
    icon: 'actuator',
    logo: tool4Logo,
  },
  {
    id: 'compressor-sizing',
    name: 'Advanced Compressor Tool',
    desc: 'Size reciprocating and centrifugal compressors. Air compressor selection and performance calculator.',
    file: '/tools/tool6.html',
    badge: 'free',
    icon: 'compressor',
    logo: tool5Logo,
  },
]
