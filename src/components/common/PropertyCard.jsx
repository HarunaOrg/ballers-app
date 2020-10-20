import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import { Link } from '@reach/router';
import { RightArrowIcon } from 'components/utils/Icons';
import PropertyPlaceholderImage from 'assets/img/placeholder/property-holder.jpg';
import { moneyFormatInNaira } from 'utils/helpers';
import { LoveIcon } from 'components/utils/Icons';
import { UserContext } from 'context/UserContext';
import { BASE_API_URL } from 'utils/constants';
import Axios from 'axios';
import { getTokenFromStore } from 'utils/localStorage';
import BallersSpinner from 'components/utils/BallersSpinner';

const PropertyCard = (property) => {
  const {
    name,
    address,
    favorites,
    houseType,
    mainImage,
    price,
    _id,
  } = property;
  const [loading, setLoading] = React.useState(false);
  const isFavorite = (favorites || []).includes(_id);
  let { userDispatch } = React.useContext(UserContext);

  const handleFavorites = (propertyId) => {
    setLoading(true);
    const FAVORITE_URL = isFavorite ? 'remove-favorite' : 'add-to-favorites';
    console.log('FAVORITE_URL', FAVORITE_URL);
    Axios.post(
      `${BASE_API_URL}/user/${FAVORITE_URL}`,
      { propertyId },
      {
        headers: {
          Authorization: getTokenFromStore(),
        },
      }
    )
      .then(function (response) {
        const { status } = response;
        if (status === 200) {
          setLoading(false);
          userDispatch({ type: FAVORITE_URL, property });
        }
      })
      .catch(function () {
        setLoading(false);
      });
  };

  return (
    <section className="mb-3">
      <Card className="card-container property-holder">
        {loading ? (
          <div className="favorites-icon">
            <BallersSpinner small />
          </div>
        ) : (
          <div
            className={`favorites-icon ${
              isFavorite
                ? 'favorites-icon__is-favorite'
                : 'favorites-icon__not-favorite'
            }`}
            onClick={() => handleFavorites(_id)}
          >
            <span>
              <LoveIcon />
            </span>
          </div>
        )}
        <div className="row">
          <div className="col-md-5">
            <img
              src={mainImage || PropertyPlaceholderImage}
              alt="Property"
              className="img-fluid property-holder__img"
            />
          </div>
          <div className="col-md-7">
            <h5 className="font-weight-500 mt-3 mt-md-0">{name}</h5>
            <div className="property-holder__location">
              Location:{' '}
              <strong>
                {address.city}, {address.state}
              </strong>
            </div>
            <div className="property-holder__house-type">
              House Type: <strong>{houseType}</strong>
            </div>

            <h5 className="mt-2">{moneyFormatInNaira(price)}</h5>
            <div className="property-holder__separator"></div>

            <Link
              className="text-uppercase small float-right badge badge-dark property-holder__details"
              to={`/user/portfolio/${_id}`}
            >
              Details{' '}
              <div className="small-icon">
                <RightArrowIcon />
              </div>
            </Link>
          </div>
        </div>
      </Card>
    </section>
  );
};

export const RecommendedPropertyLists = ({ properties, propertyClassName }) => {
  const { userState } = React.useContext(UserContext);
  let favoritePropertyIds = userState.favorites.map((p) => p._id);

  return properties.map((property) => (
    <div className={propertyClassName} key={property._id}>
      <PropertyCard {...property} favorites={favoritePropertyIds} />
    </div>
  ));
};

RecommendedPropertyLists.propTypes = {
  properties: PropTypes.array.isRequired,
  propertyClassName: PropTypes.string,
};

RecommendedPropertyLists.defaultProps = {
  propertyClassName: '',
};

export default PropertyCard;
