import React from "react";
import { useSelector } from 'react-redux';
import { Button } from "../Button";
import {
  InfoContainer,
  InfoWrapper,
  InfoRow,
  Column1,
  Column2,
  TextWrapper,
  TopLine,
  Heading,
  Subtitle,
  BtnWrap,
  ImgWrap,
  Img,
} from "./InfoElements";

const InfoSection = ({ 
  lightBg, id, imgStart, topLine, lightText, headline, 
  darkText, description, buttonLabel, img, alt, primary, dark, dark2 
}) => {
  
  // 2. Grab the user from your Redux store
  // Make sure this matches how your userSlice state is structured
  const user = useSelector((state) => state.user.user); 

  return (
    <>
      <InfoContainer lightBg={lightBg} id={id}>
        <InfoWrapper>
          <InfoRow imgStart={imgStart}>
            <Column1>
              <TextWrapper>
                <TopLine>{topLine}</TopLine>
                <Heading lightText={lightText}>{headline}</Heading>
                <Subtitle darkText={darkText}>{description}</Subtitle>
                
                {/* 3. Wrap your Button/BtnWrap in a condition */}
                {/* This says: If there is NO user logged in, show the button */}
                {!user && (
                  <BtnWrap>
                    <Button 
                      to="/auth" // Or wherever your button redirects
                      primary={primary ? 1 : 0}
                      dark={dark ? 1 : 0}
                      dark2={dark2 ? 1 : 0}
                    >
                      {buttonLabel}
                    </Button>
                  </BtnWrap>
                )}
                
              </TextWrapper>
            </Column1>
            {/* ... rest of your column/image code ... */}
          </InfoRow>
        </InfoWrapper>
      </InfoContainer>
    </>
  );
};

export default InfoSection;
