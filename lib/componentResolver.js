import MainHero from '../components/Hero';
import CallToAction from '../components/CallToAction/CallToAction';
import PersonalizedHero from '../components/PersonalizedHero';
import TalkList from '../components/TalkList/TalkList';
import RegisterForm from '../components/RegisterForm';
import WhyAttend from '../components/WhyAttend';

const componentMap = {
  hero: MainHero,
  cta: CallToAction,
  // that's 'personalized hero' to you, sir.
  '3zPkEj1KqeSn4QdsdnNKO3': PersonalizedHero,
  talksList: TalkList,
  registrationForm: RegisterForm,
  whyAttend: WhyAttend,
};

export function componentResolver(variantType) {
  const component = componentMap[variantType];
  if (!component) {
    // eslint-disable-next-line no-console
    console.warn(`Component for variantType '${variantType}' could not be resolved.`);
  }
  return component;
}
