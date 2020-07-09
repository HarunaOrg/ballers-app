import React from 'react';
import Header from 'components/layout/Header';
import { ReactComponent as PolkaDot } from 'assets/img/backgrounds/polka-dot.svg';
import HomeImage from 'assets/img/home.png';
import Income from 'assets/img/icons/income.png';
import Estates from 'assets/img/icons/estates.png';
import Credible from 'assets/img/icons/credible.png';
import Investment from 'assets/img/icons/investment.png';
import Fluid from 'assets/img/icons/fluid.png';
import PhoneImage from 'assets/img/phone.png';
import { Card } from 'react-bootstrap';
import Slider from 'react-slick';

const Home = () => (
  <>
    <Header />
    <HoldingSection />
    <AboutSection />
    <BenefitsSection />
    <HowItWorksSection />
  </>
);

const HoldingSection = () => (
  <section>
    <div className="row mr-0 ml-0">
      <section className="col-md-6 pl-6">
        <h1 className="mt-6">
          Become <br /> a LandLord
        </h1>
        <p className="mt-4 text-muted">
          We make owning a home simpler and achievable.
        </p>
        <div className="dotted-polka">
          <PolkaDot width="100" />
        </div>
        {/* <section className="card mt-n8">
            <div className="input-group mb-3">
              <input
                className="form-control rounded mx-0"
                type="text"
                placeholder="Email"
                aria-label="Email"
              />
              <input
                className="form-control rounded mx-0"
                type="text"
                placeholder="Email"
                aria-label="Email"
              />
              <input
                className="form-control rounded mx-1"
                type="text"
                placeholder="Password"
                aria-label="Password"
              />
              <button className="btn btn-secondary" type="button">
                Register
              </button>
            </div>
          </section> */}

        <p className="holding-small">
          The only realistic burden free process of owning your ideal home.
        </p>
      </section>
      <section className="col-md-6 home-bg"></section>
    </div>
  </section>
);

const AboutSection = () => (
  <section className="container-fluid bg-blue">
    <div className="row my-4">
      <div className="col-sm-6 col-12 text-center">
        <img src={HomeImage} className="img-fluid home-image" alt="home" />
      </div>
      <div className="col-sm-6 col-12 about">
        <h6 className="text-green">ABOUT BALL</h6>
        <h2>
          Game-changing service <br /> that makes owning <br /> your home easier
        </h2>
        <p className="my-5 text-normal">
          We make owning a home simpler and achievable. <br /> With BALL unique
          saving plan tailored to you and your <br /> financial position,owning
          a home has never been easier.
        </p>
        <button className="btn btn-secondary">LEARN MORE</button>
      </div>
    </div>
  </section>
);

const BenefitsSection = () => {
  const BALLERS_BENEFITS = [
    {
      title: 'Recurring Income',
      body:
        'You can create several income generating streams from just becoming a member; referral income (the best in the industry), bonus points, interest on your contribution.',
      image: Income,
    },
    {
      title: 'Existing Estates',
      body:
        'We brought you the I-Factor and then Blissville, you can clearly see that our mantra is value driven quality real estate that enhances your overall living experience.',
      image: Estates,
    },
    {
      title: 'Credibility',
      body:
        'Powered by a team of seasoned professionals with extensive track record.',
      image: Credible,
    },
    {
      title: 'Investment Oriented',
      body:
        'For every contribution you make you get immediate bonus points that can easily be redeemed for a wide range of relaxing and sumptuous social activities.',
      image: Investment,
    },
    {
      title: 'Fluidity &amp; Flexibility',
      body:
        'You can choose any amount to contribute once you have started and  you can pause or exit the scheme if so desired.',
      image: Fluid,
    },
  ];
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  return (
    <section className="benefits bg-blue">
      <div className="text-center">
        <h6 className="text-green">BENEFITS</h6>
        <h3>Why Ballers is Special</h3>
      </div>
      <div className="container-fluid">
        <Slider {...settings}>
          {BALLERS_BENEFITS.map((benefit, index) => (
            <Card width="150px" key={index}>
              <Card.Img
                variant="top"
                src={benefit.image}
                className="img-fluid benefits-icon"
                alt={benefit.title}
              />
              <Card.Body>
                <Card.Title>{benefit.title}</Card.Title>
                <Card.Text>{benefit.body}</Card.Text>
              </Card.Body>
            </Card>
          ))}
        </Slider>
      </div>
    </section>
  );
};

const HowItWorksSection = () => (
  <section className="container-fluid my-4">
    <div className="row">
      <div className="col-lg-4 mt-6">
        <img src={PhoneImage} alt="phone" className="img-fluid" />
      </div>
      <div className="col-lg-6 offset-lg-2">
        <h6 className="text-green">HOW IT WORKS</h6>
        <h3>BALLing is as easy as ABC</h3>

        <ul className="timeline mt-5">
          <li className="timeline__border">
            <h5 className="text-secondary font-weight-normal">
              <span className="font-weight-bold text-secondary h3">A</span>pply
              now
            </h5>
            <p className="pr-8 pb-4">
              Take control of your destiny and create a worthy legacy by filling
              our short registration form.
            </p>
          </li>
          <li className="timeline__border">
            <h5 className="text-secondary font-weight-normal">
              <span className="font-weight-bold text-secondary h3">B</span>egin
              periodic contribution
            </h5>
            <p className="pr-8 pb-4">
              Cultivate the habit of contribution today and reap the rewards
              forever with BALLers.
            </p>
          </li>
          <li>
            <h5 className="text-secondary font-weight-normal">
              <span className="font-weight-bold text-secondary h3">C</span>
              onvert to home ownership
            </h5>
            <p className="pr-8 pb-4">
              Convert structure to extended mortgage plan at affordable rates
              from 6% per annum.
            </p>
            <button className="btn btn-secondary">SIGN UP NOW</button>
          </li>
        </ul>
      </div>
    </div>
  </section>
);
export default Home;
