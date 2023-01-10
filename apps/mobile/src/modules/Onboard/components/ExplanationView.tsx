import { useTranslation } from 'react-i18next';

import { useOnboard } from '../hooks';
import { PageView } from './PageView';

export function ExplanationView({ onNext }: { onNext: () => void }) {
  const { t } = useTranslation();

  const { setIsFirstLaunch } = useOnboard();

  const handleNextPress = () => {
    setIsFirstLaunch(false);
    onNext();
  };

  return (
    <PageView
      title={t('welcomeScreen.explalantionView.title')}
      description={t('welcomeScreen.explalantionView.description')}
      buttonLabel={t('common.next')}
      imageSrc={require('./users-around-world.png')}
      onPress={handleNextPress}
    />
  );
}
