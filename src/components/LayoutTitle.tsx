import { Text } from 'react-native';

export const LayoutTitle = ({ title, size = 18 }: { title: string; size?: number }) => {
  return (
    <Text style={{ fontSize: size }} className="font-semibold text-white/90">
      {title}
    </Text>
  );
};
