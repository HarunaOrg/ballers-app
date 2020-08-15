import React from 'react';
import Header from 'components/layout/Header';
import CommunityGallery from 'components/common/CommunityGallery';
import Footer from 'components/layout/Footer';
import TitleSection from 'components/common/TitleSection';
import { Formik, Form } from 'formik';
import Input from 'components/forms/Input';
import Button from 'components/forms/Button';
import { DisplayFormikState, setInitialValues } from './form-helper';
import Textarea from './Textarea';
import {
  stringValidation,
  phoneNumber,
  email,
  strongPassword,
  // agreement,
  createSchema,
  optionalValidation,
  multiSelectValidation,
} from './schemas/schema-helpers';
import InputFormat from './InputFormat';
import DatePicker from './DatePicker';
import Select from './Select';
import RadioSelect from './RadioSelect';
import CheckboxGroup from './CheckboxGroup';
import Toast from 'components/utils/Toast';
import { useToast } from 'components/utils/Toast';
import MapPicker from 'components/utils/MapPicker';
import useMapGeocoder from 'hooks/useMapGeocoder';

const FormComponents = () => (
  <>
    <Header />

    <TitleSection name="Form Components" content="Playground for forms" />
    <Content />
    <CommunityGallery />
    <Footer />
  </>
);

const Content = () => (
  <div className="container-fluid">
    <div className="row">
      <div className="offset-lg-2 col-lg-8 mt-7">
        <h4>Form Components</h4>
        <Forms />
      </div>
    </div>
  </div>
);

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

const registerSchema = {
  firstName: stringValidation('First Name'),
  lastName: stringValidation('Last Name'),
  phoneNumber: optionalValidation(phoneNumber),
  email,
  password: strongPassword,
  message: stringValidation('Message'),
  state: multiSelectValidation('State'),
  country: stringValidation('Country'),
  // agreement,
};

const Forms = () => {
  const [toast, setToast] = useToast();
  const { latLngFromAddress } = useMapGeocoder({
    mapAddress: '4 Adebisi steet, moshalashi bus stop, shasha Lagos',
  });

  console.log('latLngFromAddress', latLngFromAddress);
  return (
    <Formik
      initialValues={setInitialValues(registerSchema, { state: ['vanilla'] })}
      onSubmit={(values, actions) => {
        setTimeout(() => {
          actions.setSubmitting(false);
        }, 4000);
      }}
      render={({ isSubmitting, handleSubmit, ...props }) => (
        <Form>
          <Toast {...toast} />
          <div className="form-row">
            <Input
              formGroupClassName="col-md-6"
              label="First Name"
              name="firstName"
              placeholder="First Name"
            />
            <Input
              formGroupClassName="col-md-6"
              label="Last Name"
              name="lastName"
              tooltipText="Here is the Last Name"
            />
          </div>
          <div className="form-row">
            <Input
              formGroupClassName="col-md-6"
              label="Email"
              name="email"
              placeholder="Valid Email"
              tooltipText="A valid email address, needed for login"
            />
            <InputFormat
              formGroupClassName="col-md-6"
              label="Phone Number"
              name="phoneNumber"
              optional
            />
          </div>
          <Input
            label="Password"
            name="password"
            placeholder="Password"
            type="password"
            tooltipText={<p className="text-danger">Your Password :-)</p>}
          />
          <div className="form-row">
            <Select
              formGroupClassName="col-md-6"
              label="State"
              name="state"
              isMulti
              placeholder="Select State"
              options={options}
              tooltipText="A valid email address, needed for login"
            />
            <Select
              formGroupClassName="col-md-6"
              label="Country"
              name="country"
              options={options}
              optional
            />
          </div>

          <div className="row">
            <div className="col-12">
              <RadioSelect
                label="Testing 123"
                name="sex"
                options={[
                  { label: 'Male', value: 'male' },
                  { label: 'Female', value: 'female' },
                ]}
                tooltipText="Testing Radio"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <CheckboxGroup
                inline
                label="Preference"
                name="pref"
                options={[
                  { label: 'Receive Newsletter' },
                  { value: 'Love Newsletter' },
                ]}
                // options can contain either value or label
              />
            </div>
          </div>

          <div className="form-row">
            <DatePicker
              formGroupClassName="col-md-6"
              label="Event Date"
              name="eventDate"
              placeholder="Event Date"
            />
            <DatePicker
              label="Event Time"
              formGroupClassName="col-md-6"
              dateFormat="h:mm aa"
              name="event-time"
              showTimeSelect
              showTimeSelectOnly
              timeCaption="Start Time"
              timeIntervals={30}
            />
          </div>

          <Textarea
            label="Message"
            name="message"
            placeholder="Your Message..."
            tooltipText={<p className="text-danger">Enter your content</p>}
          />

          <MapPicker />

          <Button
            className="btn-danger"
            loading={isSubmitting}
            onClick={handleSubmit}
            showLoadingText={false}
          >
            Register
          </Button>

          <Button
            onClick={() =>
              setToast({ message: 'This is a sample error message' })
            }
          >
            Show Error Toast
          </Button>
          <Button
            onClick={() =>
              setToast({
                message: 'This is a sample error message',
                type: 'success',
              })
            }
          >
            Show Success
          </Button>
          <DisplayFormikState {...props} />
        </Form>
      )}
      validationSchema={createSchema(registerSchema)}
    />
  );
};

export default FormComponents;
