import { Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const ProfileImage = ({ imgPath }: { imgPath: string | null }) => {
  if (!imgPath) {
    return <LinearGradient colors={['#3A4CA8', '#7B5FCC']} style={styles.gradientCircle} />;
  }

  return <Image source={{ uri: imgPath }} style={styles.imageCircle} resizeMode="cover" />;
};

const styles = StyleSheet.create({
  imageCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  gradientCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
