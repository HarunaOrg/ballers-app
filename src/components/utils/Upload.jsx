import Axios from 'axios';
import PropTypes from 'prop-types';
import React from 'react';
import { BASE_API_URL } from 'utils/constants';
import { getTokenFromStore } from 'utils/localStorage';
import { useToast } from './Toast';
import { getError } from 'utils/helpers';
import Toast from './Toast';
import BallersSpinner from './BallersSpinner';
import { UploadIcon } from './Icons';
import Image from './Image';

const Upload = ({
  afterUpload,
  allowPdf,
  changeText,
  children,
  defaultImage,
  imgOptions,
  maxFileSize,
  name,
  uploadText,
}) => {
  const [toast, setToast] = useToast();
  const [loading, setLoading] = React.useState(false);
  const [uploadedFile, setUploadedFile] = React.useState(null);

  const onFileChange = async (event) => {
    const fileToUpload = event?.target?.files?.[0];

    setLoading(true);
    setToast({ message: null });
    if (!fileToUpload) return null;

    if (fileToUpload.size > maxFileSize) {
      setToast({
        message: `'${
          fileToUpload.name
        }' is too large, please pick a file smaller than ${
          maxFileSize / 1000
        }kb`,
      });
      setLoading(false);
      return null;
    }

    if (fileToUpload) {
      const type = fileToUpload.type;
      const extension = fileToUpload.name.split('.').pop();
      let allowedFormats = ['jpg', 'jpeg', 'gif', 'png'];

      if (allowPdf) {
        allowedFormats.push('pdf');
      }

      if (!allowedFormats.includes(extension)) {
        setToast({
          message: `Unsupported extension. Only ${allowedFormats.join(
            ', '
          )} are allowed.`,
        });
        setLoading(false);
        return null;
      }

      const uploadConfig = await Axios.get(`${BASE_API_URL}/user/upload`, {
        params: {
          extension,
          type,
        },
        headers: {
          Authorization: getTokenFromStore(),
        },
      }).catch(function (error) {
        setToast({
          message: getError(error),
        });
        setLoading(false);
        return null;
      });

      if (uploadConfig) {
        Axios.put(uploadConfig.data.url, fileToUpload, {
          headers: { 'Content-Type': type },
        })
          .then(() => {
            const AWS_BUCKET =
              process.env.REACT_APP_AWS_S3_BUCKET || 'ballers-staging';
            const fileURL = `https://${AWS_BUCKET}.s3.amazonaws.com/${uploadConfig.data.key}`;
            setUploadedFile(fileURL);
            afterUpload(fileURL);
            setLoading(false);
          })
          .catch(function (error) {
            setToast({
              message: getError(error),
            });
            setLoading(false);
          });

        return null;
      }
      setToast({
        message: 'Unable to upload file',
      });
      setLoading(false);
    }
  };

  const currentImage = uploadedFile || defaultImage;
  const inputHasAnImage = !!currentImage;
  const accept = `image/*${allowPdf ? ',.pdf' : ''}`;
  const id = name || 'upload-file';
  return (
    <>
      <Toast {...toast} showToastOnly />
      {children ||
        (currentImage && (
          <Image
            defaultImage={defaultImage}
            src={currentImage}
            name={name || 'uploaded-image'}
            {...imgOptions}
          />
        ))}
      <div className="custom-file-upload mt-3">
        <input
          type="file"
          id={id}
          name={name || 'myfile'}
          accept={accept}
          onChange={onFileChange}
        />
        <label htmlFor={id}>
          {loading ? (
            <>
              <BallersSpinner small /> Uploading File
            </>
          ) : (
            <>
              <UploadIcon />{' '}
              {inputHasAnImage ? (
                <>{changeText || 'Change File'}</>
              ) : (
                <>{uploadText || 'Upload New File'}</>
              )}
            </>
          )}
        </label>
      </div>
    </>
  );
};

Upload.propTypes = {
  afterUpload: PropTypes.func,
  allowPdf: PropTypes.bool,
  changeText: PropTypes.string,
  children: PropTypes.any,
  defaultImage: PropTypes.string,
  imgOptions: PropTypes.bool,
  maxFileSize: PropTypes.number,
  name: PropTypes.string,
  uploadText: PropTypes.string,
};

Upload.defaultProps = {
  afterUpload: () => {},
  allowPdf: false,
  changeText: null,
  children: null,
  defaultImage: null,
  imgOptions: {},
  maxFileSize: 1_000_000, // 1 MB
  name: null,
  uploadText: null,
};

export default Upload;
