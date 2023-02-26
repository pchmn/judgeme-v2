import { useTranslation } from 'react-i18next';

import { PageView } from './PageView';

export function ExplanationView({ onNext }: { onNext: () => void }) {
  const { t } = useTranslation();

  return (
    <PageView
      title={t('welcomeScreen.explalantionView.title')}
      description={t('welcomeScreen.explalantionView.description')}
      buttonLabel={t('common.next')}
      imageSrc={require('./users-around-world.png')}
      onPress={onNext}
    />
  );
}
