import React from 'react';
import PropTypes from 'prop-types';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import { Link, navigate } from '@reach/router';
import { Formik, Form } from 'formik';
import Axios from 'axios';
import Input from 'components/forms/Input';
import { feedback } from 'components/forms/form-helper';
import Button from 'components/forms/Button';
import { createSchema } from 'components/forms/schemas/schema-helpers';
import { loginSchema } from 'components/forms/schemas/userSchema';
import { EmptyTitleSection } from 'components/common/TitleSection';
import Toast, { useToast } from 'components/utils/Toast';
import { BASE_API_URL, DASHBOARD_PAGE } from 'utils/constants';
import { UserContext } from 'context/UserContext';
import { storeToken, storeUserType } from 'utils/localStorage';

const Login = () => (
  <>
    <Header />
    <EmptyTitleSection>
      <Content />
    </EmptyTitleSection>
    <Footer />
  </>
);
const Content = ({ redirectTo, sid, token }) => {
  return (
    <section>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-5 auth__text">
            <h1>
              Welcome Back, <br />
            </h1>
            <p className="lead">
              Sign in to access your profile, rewards and contributions.
            </p>
          </div>
          <div className="offset-lg-2 col-lg-5">
            <div className="card p-5 my-6">
              <LoginForm redirectTo={redirectTo} sid={sid} token={token} />
              <section className="auth__footer">
                <div className="register mt-6 text-center">
                  Not Registered?{' '}
                  <Link className="auth__link" to="/register">
                    {' '}
                    Create Account
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
        <p />
      </div>
    </section>
  );
};

Content.propTypes = {
  redirectTo: PropTypes.string,
  sid: PropTypes.string,
  token: PropTypes.string,
};

Content.defaultProps = {
  redirectTo: null,
  sid: null,
  token: null,
};

const LoginForm = ({ redirectTo, sid, token }) => {
  const [toast, setToast] = useToast();
  const { userState, userDispatch } = React.useContext(UserContext);

  // CHECK TOKEN ACTIVATION
  React.useEffect(() => {
    token &&
      Axios.get('/api/v1/users/activate', { params: { token } })
        .then(function (response) {
          const { status, data } = response;
          // handle success
          if (status === 200) {
            console.log('data', data);
            setToast({
              type: 'success',
              message: data.message,
            });
          }
        })
        .catch(function (error) {
          setToast({
            message: error.response.data.message,
          });
        });
  }, [token, setToast]);

  // CHECK IF USER HAS SIGNED IN
  React.useEffect(() => {
    if (userState && userState.isLoggedIn) {
      const dashboardUrl = `/${DASHBOARD_PAGE[userState.role]}/dashboard`;
      navigate(redirectTo || dashboardUrl);
    }
  }, [userState, redirectTo]);

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      onSubmit={(values, actions) => {
        Axios.post(`${BASE_API_URL}/user/login`, values)
          .then(function (response) {
            const { status, data } = response;
            if (status === 200) {
              storeToken(data.user.token);
              storeUserType(data.user.role);
              userDispatch({ type: 'user-login', user: data.user });
            }
          })
          .catch(function (error) {
            setToast({
              message: error.response.data.message,
            });
            actions.setSubmitting(false);
          });
      }}
      validationSchema={createSchema(loginSchema)}
    >
      {({ isSubmitting, handleSubmit }) => {
        const submitFormWithEnterKey = (event) => {
          if (event.keyCode === 13) {
            handleSubmit();
          }
        };
        return (
          <Form>
            <Toast {...toast} />
            <Input
              label="Email"
              name="email"
              onKeyDown={(e) => submitFormWithEnterKey(e)}
              placeholder="Email Address"
              showFeedback={feedback.NONE}
              tabIndex={1}
            />
            <Input
              label="Password"
              labelClassName="d-block"
              labelLink={{
                to: '/forgot-password',
                text: 'Forgot Password',
              }}
              name="password"
              onKeyDown={(evt) => submitFormWithEnterKey(evt)}
              placeholder="Password"
              showFeedback={feedback.NONE}
              tabIndex={2}
              type="password"
            />
            <Button loading={isSubmitting} onClick={handleSubmit}>
              Sign in
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
};

LoginForm.propTypes = {
  redirectTo: PropTypes.string,
  sid: PropTypes.string,
  token: PropTypes.string,
};

LoginForm.defaultProps = {
  redirectTo: null,
  sid: null,
  token: null,
};

export default Login;
