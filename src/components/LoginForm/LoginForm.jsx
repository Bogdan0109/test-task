import { Formik, ErrorMessage } from 'formik';
import {
  Button,
  ButtonGoogl,
  Container,
  Div,
  Input,
  P,
  ErrorText,
  LoginButton,
  Span,
  Block,
  SpanEmailPassword,
  Forma,
} from './LoginForm.styled';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { ReactComponent as GoogleSvg } from 'images/google.svg';

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import { logIn } from 'redux/auth/authOperations';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
const schema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Enter your email'),
  password: Yup.string().min(8).max(20).required('Enter your password'),
});
const FormError = ({ name }) => {
  return (
    <ErrorMessage
      name={name}
      render={message => <ErrorText>{message}</ErrorText>}
    />
  );
};

// console.log('LoginForm ---> start'); //!

export const LoginForm = () => {
  const dispatch = useDispatch();
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get('email');
  const password = urlParams.get('password');
  useEffect(() => {
    // console.log('LoginForm ---> value:', { email, password });
    if (email) {
      dispatch(logIn({ email, password }));
    }
  }, [dispatch, email, password]);

<<<<<<< Updated upstream
  const handleSubmit = (value, { resetForm }) => {
    // console.log('LoginForm ---> handleSubmit'); //!
    // console.log('LoginForm ---> value:', value); //!
    dispatch(logIn(value));

=======
  const handleSubmit = ({ email, password }, { resetForm }) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(({ user }) => {
        dispatch(
          logIn({ email: user.email, id: user.uid, token: user.accessToken })
        );
      })
      .catch(console.error);

    // console.log('LoginForm ---> handleSubmit'); //!
    // console.log('LoginForm ---> value:', email, password); //!
    // dispatch(logIn(value));
>>>>>>> Stashed changes
    resetForm();
  };

  // console.log('LoginForm ---> render'); //!
  return (
    <Container>
      <P>You can log in with your Google Account:</P>
      <ButtonGoogl href="https://easy-start-wallet-back.onrender.com/api/users/google/">
        <GoogleSvg />
      </ButtonGoogl>

      <P>Or log in using an email and password, after registering:</P>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={schema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Forma autoComplete="off">
            <label htmlFor="login" style={{ position: 'relative' }}>
              {errors.email && touched.email ? <Span>*</Span> : null}{' '}
              <SpanEmailPassword>Email:</SpanEmailPassword>
              <Block>
                <Input type="email" name="email" placeholder="Email address" />
                <FormError name="email" component="div" />
              </Block>
            </label>

            <Block>
              <label htmlFor="password">
                {errors.password && touched.password ? <Span>*</Span> : null}{' '}
                <SpanEmailPassword>Password:</SpanEmailPassword>
                <Input
                  type="password"
                  name="password"
                  placeholder="Security password"
                />
                <FormError
                  name="password"
                  style={{ position: 'absolute', bottom: 0, left: 0 }}
                />
              </label>
            </Block>
            <Div>
              <LoginButton type="submit">LOG IN</LoginButton>
              <Link to="/register">
                <Button type="button">REGISTRATION</Button>
              </Link>
            </Div>
          </Forma>
        )}
      </Formik>
    </Container>
  );
};
