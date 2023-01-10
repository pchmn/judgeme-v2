import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Appbar as RnpAppbar } from 'react-native-paper';

export function Appbar({ navigation, back }: NativeStackHeaderProps) {
  return (
    <RnpAppbar.Header>
      {back ? <RnpAppbar.BackAction onPress={navigation.goBack} /> : null}
      <RnpAppbar.Content title="My awesome app" />
    </RnpAppbar.Header>
  );
}
