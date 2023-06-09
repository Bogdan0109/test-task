import { useDispatch } from 'react-redux';
import { addTransaction } from '../../redux/transaction/transactionOperations';
import * as Yup from 'yup';
import moment from 'moment';
import { Formik, ErrorMessage } from 'formik';
import useScreenResizing from '../../hooks/useScreenResizing';
import { CustomSelect } from '../CustomSelect/CustomSelect';
import { DataBox } from '../DataBox/DataBox';
import { Loader } from '../Loader/Loader';
import {
  InputField,
  FormBox,
  DataWrapper,
  FormInputWrapper,
  SecondaryInputWrapper,
  CalculatorIcon,
  TextSecondary,
  BtnSubmitList,
  BtnSubmitItem,
  BtnSubmit,
  BtnSecondary,
  InputsBox,
  FormTopWrapper,
  IconWrapper,
  ErrorNotification,
  ErrorMessageWrapper,
} from './ExpensesForm.styled';

import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const options = [
  { value: 'Transport', label: 'Transport' },
  { value: 'Products', label: 'Products' },
  { value: 'Health', label: 'Health' },
  { value: 'Alcohol', label: 'Alcohol' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Housing', label: 'Housing' },
  { value: 'Technique', label: 'Technique' },
  { value: 'Communal, communication', label: 'Communal, communication' },
  { value: 'Sports, hobbies', label: 'Sports, hobbies' },
  { value: 'Education', label: 'Education' },
  { value: 'Other', label: 'Others' },
];

const initialValues = {
  category: '',
  description: '',
  sum: '',
};

const schema = Yup.object().shape({
  category: Yup.string().required('Select category'),
  description: Yup.string()
    .min(3)
    .max(16)
    .required('Enter product description'),
  sum: Yup.number('Invalid sum, only numbers')
    .positive('Only positive value')
    .required('Enter sum'),
});

const FormError = ({ name }) => {
  return (
    <ErrorMessage
      name={name}
      render={message => <ErrorNotification>{message}</ErrorNotification>}
    />
  );
};

const ExpensesForm = () => {
  const viewPort = useScreenResizing();
  const dispatch = useDispatch();

  const date = moment().format('DD.MM.YYYY');

  // const getFormData = values => {
  //   console.log('getFormData::', values);
  // };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={async (values, { resetForm }) => {
          try {
            const docRef = await addDoc(collection(db, 'users'), {
              ...values,
              transactionsType: 'expenses',
              date,
            });
            console.log('Document written with ID: ', docRef.id);
          } catch (e) {
            console.error('Error adding document: ', e);
          }

          dispatch(
            addTransaction({
              ...values,
              transactionsType: 'expenses',
              date,
            })
          );
          resetForm();
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          resetForm,
        }) => {
          return (
            <FormBox onSubmit={handleSubmit}>
              <FormTopWrapper>
                <DataWrapper>
                  <DataBox date={date} />
                </DataWrapper>
                <InputsBox>
                  <FormInputWrapper>
                    <InputField
                      as="input"
                      type="text"
                      id="description"
                      name="description"
                      placeholder="Product description"
                      onChange={handleChange}
                      value={values.description}
                    />
                    <CustomSelect
                      name="category"
                      options={options}
                      value={values.category}
                      type="Product category"
                      disabled={isSubmitting}
                      isLoading={isSubmitting}
                      onChange={values =>
                        setFieldValue('category', values.value)
                      }
                    ></CustomSelect>
                  </FormInputWrapper>
                  <SecondaryInputWrapper>
                    <div>
                      <TextSecondary
                        as="input"
                        type="number"
                        id="sum"
                        name="sum"
                        pattern="^(([0-9]*)|(([0-9]*)\.([0-9]*)))$"
                        title="Sum must be whole numbers (or decimal numbers)"
                        placeholder={
                          viewPort.width > 767 ? '00.00' : '00.00UAH'
                        }
                        onChange={handleChange}
                        value={values.sum}
                      />
                      <ErrorMessageWrapper>
                        {errors.description && touched.description ? (
                          <FormError name="description" component="p" />
                        ) : errors.category && touched.category ? (
                          <FormError name="category" component="p" />
                        ) : errors.sum && touched.sum ? (
                          <FormError name="sum" component="p" />
                        ) : null}
                      </ErrorMessageWrapper>
                    </div>
                    <IconWrapper>
                      <CalculatorIcon />
                    </IconWrapper>
                  </SecondaryInputWrapper>
                </InputsBox>
              </FormTopWrapper>
              {isSubmitting ? (
                <Loader />
              ) : (
                <BtnSubmitList>
                  <BtnSubmitItem>
                    <BtnSubmit type="submit" disabled={isSubmitting}>
                      Input
                    </BtnSubmit>
                  </BtnSubmitItem>
                  <BtnSubmitItem>
                    <BtnSecondary
                      type="reset"
                      onClick={resetForm}
                      disabled={isSubmitting}
                    >
                      Clear
                    </BtnSecondary>
                  </BtnSubmitItem>
                </BtnSubmitList>
              )}
            </FormBox>
          );
        }}
      </Formik>
    </>
  );
};

export default ExpensesForm;
