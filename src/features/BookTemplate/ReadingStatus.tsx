import { Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ReadingStatusProps {
  progress: number;
}

export const ReadingStatus = ({ progress = 50 }: ReadingStatusProps) => {
  const gradientColors: [string, string, string] =
    progress < 40
      ? ['#003B8E', '#0074E4', '#00A8E8']
      : progress < 80
        ? ['#005EFF', '#1FAEFF', '#5BE3FF']
        : ['#0099FF', '#00E0FF', '#80FFF7'];

  return (
    <View style={{ marginHorizontal: 16, marginTop: 16, gap: 12 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: '600',
          color: '#CFE3FF',
        }}>
        Reading Status
      </Text>

      <View
        style={
          {
            height: 22,
            backgroundColor: 'rgba(255,255,255,0.06)',
            borderRadius: 12,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.1)',
          } as ViewStyle
        }>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            width: `${progress}%`,
            height: '100%',
            borderRadius: 12,
            shadowColor: gradientColors[1],
            shadowOpacity: 0.4,
            shadowRadius: 6,
          }}
        />
      </View>

      <Text
        style={{
          color: '#9DB5E0',
          textAlign: 'center',
          fontSize: 14,
          fontWeight: '500',
          letterSpacing: 0.3,
        }}>
        {progress === 100 ? `${progress}% Complete` : `${progress}% Read`}
      </Text>
    </View>
  );
};
