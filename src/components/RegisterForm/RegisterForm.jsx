import { Formik, Form, ErrorMessage } from 'formik';

import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  ButtonGoogl,
  Container,
  Div,
  Input,
  P,
  ErrorText,
  RegisterButton,
  Span,
  Block,
} from './RegisterForm.styled';
import { ReactComponent as GoogleSvg } from 'images/google.svg';

import { useDispatch } from 'react-redux';

import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../firebase';

import { register } from 'redux/auth/authOperations';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

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

console.log('RegisterForm ---> start'); //!

export const RegisterForm = () => {
  const navigate = useNavigate(); ///для возможности переходить по ссылке при нажатии на кнопку типа баттон
  const handleClick = () => {
    console.log('isdhfuiwfiewyr9y293r9ewr9ew', 'isdhfuiwfiewyr9y293r9ewr9ew');
    navigate('/register'); //// у цьому місці треба прописати шлях до бекенду.нижче розшифрувала
    signInWithPopup(auth, provider).then(({ user }) => {
      console.log(
        '🚀 ~ file: RegisterForm.jsx:51 ~ signInWithPopup ~ user:',
        user
      );
      dispatch(
        register({ email: user.email, id: user.uid, token: user.accessToken })
      );
    });
  };

  const dispatch = useDispatch();
  // const [errorSymbol, setErrorSymbol] = useState('*');

  const handleSubmit = ({ email, password }, { resetForm }) => {
    navigate('/register'); //// у цьому місці треба прописати шлях до бекенду.нижче розшифрувала
    ///('   ')---'доменне ім'я серверу/шлях до ресурсу на сервері де відбувається аутентифікація/додатковий шлях де аутентифікація відбувається через google'

    // const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then(({ user }) => {
        dispatch(
          register({ email: user.email, id: user.uid, token: user.accessToken })
        );
      })
      .catch(error => {
        console.log('error.message', error.message);
        if (error.message === 'Firebase: Error (auth/email-already-in-use).') {
          toast.error(`Email ${email} in use`, {
            position: 'top-center',
            autoClose: 2000,
          });
        }

        if (error.message === 'Firebase: Error (auth/invalid-email).') {
          toast.error(`User creation error`, {
            position: 'top-center',
            autoClose: 2000,
          });
        }
      });

    console.log('RegisterForm ---> handleSubmit'); //!
    // console.log('RegisterForm ---> value:', value); //!
    // dispatch(register(value));
    resetForm();
  };

  return (
    <Container>
      <P>You can log in with your Google Account:</P>

      <ButtonGoogl type="button" onClick={handleClick}>
        <GoogleSvg />
      </ButtonGoogl>

      <P>Or log in using an email and password for registeration:</P>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={schema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form autoComplete="off">
            <label htmlFor="login" style={{ position: 'relative' }}>
              {errors.email && touched.email ? <Span>*</Span> : null} Email:
              <Block>
                <Input type="email" name="email" placeholder="Email address" />
                <FormError name="email" component="div" />
              </Block>
            </label>

            <Block>
              <label htmlFor="password">
                {errors.password && touched.password ? <Span>*</Span> : null}{' '}
                Password:
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
              <Link to="/login">
                <Button type="button">LOG IN</Button>
              </Link>
              <RegisterButton type="submit">REGISTRATION</RegisterButton>
            </Div>
          </Form>
        )}
      </Formik>
    </Container>
  );
};
