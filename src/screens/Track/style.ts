import { StyleSheet } from 'react-native';
import { fontSize } from '../../constants/fonts';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: sizes.screenWidth * 0.05,
  },

  mainContainer: {
    flex: 1,
  },

  forgotText: {
    color: colors.heading,
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 22,
    marginTop: 15,
    textAlign:'center'
  },

  paraText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.green,
    textAlign:'center'
  },

  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Distribute buttons evenly
    alignItems: 'center',
    backgroundColor: '#E8F5E9', // Light background for the overall bar (optional, based on image)
    borderRadius: 30, // Rounded container
    padding: 4, // Inner padding to make the selector bar thicker
    marginVertical: 20, // Space below the paragraph text
  },

  // Base style for each button
});

export default styles;
