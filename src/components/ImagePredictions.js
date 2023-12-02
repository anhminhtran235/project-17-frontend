import styled from 'styled-components';
import ImagePrediction from './ImagePrediction';

const StyledImagePredictions = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;

  margin-top: 20px;
`;

const ImagePredictions = ({ imagePredictions }) => {
  return (
    <StyledImagePredictions>
      {imagePredictions.map(({ base64Data, hasDementia }, index) => (
        <ImagePrediction
          key={index}
          base64Data={base64Data}
          hasDementia={hasDementia}
        />
      ))}
    </StyledImagePredictions>
  );
};

export default ImagePredictions;
