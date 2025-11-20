import images from '../images';

export const quickTrackingData = {
  mood: [
    { label: 'Great', icon: images.excellentEmoji },
    { label: 'Good', icon: images.goodEmoji },
    { label: 'Okay', icon: images.okayEmoji },
    { label: 'Low', icon: images.lowEmoji },
  ],
  energy: [
    { label: 'Energized', icon: images.energizedEmoji },
    { label: 'High', icon: images.highEmoji },
    { label: 'Medium', icon: images.mediumEmoji },
    { label: 'Low', icon: images.lowEnergyEmoji },
  ],
  sleep: [
    { label: 'Poor', icon: images.lowEmoji },
    { label: 'Fair', icon: images.okayEmoji },
    { label: 'Good', icon: images.goodEmoji },
    { label: 'Excellent', icon: images.excellentEmoji },
  ],
};
