import { Text, TextProps, StyleSheet } from 'react-native';

export const Title = ({ style, ...props }: TextProps) => (
  <Text style={[styles.title, style]} {...props} />
);

export const Heading = ({ style, ...props }: TextProps) => (
  <Text style={[styles.heading, style]} {...props} />
);

export const Subheading = ({ style, ...props }: TextProps) => (
  <Text style={[styles.subheading, style]} {...props} />
);

export const Body = ({ style, ...props }: TextProps) => (
  <Text style={[styles.body, style]} {...props} />
);



const styles = StyleSheet.create({
    title: {
        fontSize: 16, 
        fontFamily:'SEMIBOLD',
        color: "#00000F",
    },
    heading: {
      fontSize: 14,
      fontFamily:'MEDIUM',
      color: "#00000F",
    },
    subheading: {
      fontSize: 12,
      fontFamily: 'REGULAR',
      color: "#00000F",
    },
    body: {
      fontSize: 10,
      fontFamily: 'REGULAR',
      color: '#00000F',
    },
  });
  