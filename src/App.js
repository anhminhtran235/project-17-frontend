import './App.css';

import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { useCallback, useState } from 'react';
import ShortUniqueId from 'short-unique-id';
import axios from 'axios';

import { convertBase64ToPythonBase64, toBase64 } from './util';
import ImagePredictions from './components/ImagePredictions';

const StyledApp = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  margin: auto;

  .header {
    font-size: 2.5em; /* Larger font size for header */
    font-family: 'Arial', sans-serif; /* Different font family for header */
    margin-bottom: 10px;
    text-align: center;
  }

  .description {
    margin: 0;
    font-weight: 400;
    font-family: 'Verdana', sans-serif; /* Different font family for description */
    line-height: 1.6; /* Improved line-height for readability */
    text-align: center;
  }

  .instructions {
    margin-top: 20px; /* Add margin for spacing */
    text-align: center;
  }
`;

const DragAndDropStyled = styled.div`
  width: 400px; /* Increased size */
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  border: 2px dashed #aaa; /* Subtle border style */
  background: ${(props) => (props.isDragActive ? '#eee' : '#fff')};
  cursor: pointer;
  margin-top: 20px; /* Add margin for spacing */
  &:hover {
    background-color: #e0e0e0; /* Hover effect */
    border-color: #888; /* Change border color on hover */
  }
`;

const uuid = new ShortUniqueId({ length: 10 });

function App() {
  const [imagesBase64, setImagesBase64] = useState([]);

  const onDrop = useCallback(async (acceptedFiles) => {
    try {
      const promises = acceptedFiles.map((file) => toBase64(file));

      const images = await Promise.all(promises);

      if (images.length > 10) {
        alert('Please upload less than 10 images at a time');
        return;
      }

      const imagesWithId = images.map((image) => ({
        id: uuid.rnd(),
        base64Data: image,
        hasDementia: 'PENDING...',
      }));
      setImagesBase64(imagesWithId);

      const imagesForPython = imagesWithId.map((image) => ({
        id: image.id,
        base64Data: convertBase64ToPythonBase64(image.base64Data),
      }));

      const res = await axios.post(
        'https://sfu-340-backend-new-abd2196aa506.herokuapp.com/upload',
        {
          images: imagesForPython,
        }
      );

      const predictions = res.data.predictions;

      const imagesWithPrediction = imagesWithId.map((image) => {
        const { id } = image;
        const { hasDementia } = predictions.find((image) => image.id === id);
        return { ...image, hasDementia };
      });

      setImagesBase64(imagesWithPrediction);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <StyledApp>
      <h1 className='header'>Group 17: Alzheimer Identifier</h1>
      <h2 className='description'>
        Identifying Alzheimer's Disease Using A Convolutional Neural Network
        Model
      </h2>
      <p className='instructions'>
        Instructions: Upload one or multiple brain images. The app will predict
        whether this brain has Alzheimer's disease or not
        (Demented/Nondemented). You can download data from{' '}
        <a
          target='_blank'
          href='https://www.kaggle.com/datasets/uraninjo/augmented-alzheimer-mri-dataset'
        >
          here
        </a>
      </p>

      <DragAndDropStyled isDragActive={isDragActive} {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the images here ...</p>
        ) : (
          <p>Drag images here, or click to select images</p>
        )}
      </DragAndDropStyled>

      <ImagePredictions imagePredictions={imagesBase64} />
    </StyledApp>
  );
}

export default App;
