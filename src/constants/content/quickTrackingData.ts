import images from '../images';

export const quickTrackingData = {
  mood: {
    heading: 'How are you feeling?',
    icon: images.feelingsIcon,
    data: [
      { label: 'Great', icon: images.excellentEmoji },
      { label: 'Good', icon: images.goodEmoji },
      { label: 'Okay', icon: images.okayEmoji },
      { label: 'Low', icon: images.lowEmoji },
    ],
  },
  energy: {
    heading: "What's your energy level?",
    icon: images.energyIcon,
    data: [
      { label: 'Energized', icon: images.energizedEmoji },
      { label: 'High', icon: images.highEmoji },
      { label: 'Medium', icon: images.mediumEmoji },
      { label: 'Low', icon: images.lowEnergyEmoji },
    ],
  },
  sleep: {
    heading: "How's your sleep quality?",
    icon: images.sleepQualityIcon,
    data: [
      { label: 'Poor', icon: images.lowEmoji },
      { label: 'Fair', icon: images.okayEmoji },
      { label: 'Good', icon: images.goodEmoji },
      { label: 'Excellent', icon: images.excellentEmoji },
    ],
  },
};
