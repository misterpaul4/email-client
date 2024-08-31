import { metronome } from 'ldrs';

metronome.register();

export const PrimaryLoader = ({ size = 40 }: { size?: number }) => {
  return <l-metronome size={size} speed="1.6" color="black"></l-metronome>;
};
