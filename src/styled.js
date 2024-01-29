import styled from "styled-components";

export const BlockedTd = styled.td`
  width: ${(props) => props.daySize};
  height: ${(props) => props.daySize};
  color: ${(props) => (props.isOutsideDay ? "#cacccd" : "white")};  box-sizing: border-box;
  pointer-events: "none";
  cursor: "default";
  border-collapse: collapse;
  border: 2px solid rgba(255, 255, 255, 1);
  border-spacing: 0;
  background-color: ${(props) => (props.isOutsideDay ? "white" : props.color)};
  border-radius: 7px; /* Set the border-radius for slightly rounded corners */
`;

export const Day = styled.div`
  box-shadow: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: ${(props) => props.daySize}
  height: ${(props) => props.daySize};
  span {
    font-weight:700
  }
`;

export const HighLightedTd = styled.td`
  width: ${(props) => props.daySize};
  height: ${(props) => props.daySize};
  color: ${(props) => (props.isOutsideDay ? "#cacccd" : "white")};
  box-sizing: border-box;
  pointer-events: none;
  border-collapse: collapse;
  border: 2px solid rgba(255, 255, 255, 1);
  border-spacing: 0;
  background: ${(props) =>
    props.isOutsideDay
      ? "white"
      : `linear-gradient(to top left, ${props.color1}  49%, transparent 49%, transparent 51%,  ${props.color2} 51%)`};
  border-radius: 7px; /* Set the border-radius for slightly rounded corners */
`;

export const CheckTd = styled.td`
  width: ${(props) => props.daySize};
  height: ${(props) => props.daySize};
  color: ${(props) => (props.isOutsideDay ? "#cacccd" : "black")};
  box-sizing: border-box;
  pointer-events: ${(props) =>
    props.blocked || props.isOutsideDay ? "none" : "auto"};
  cursor: ${(props) =>
    props.blocked || props.isOutsideDay ? "default" : "pointer"};
  border-collapse: collapse;
  border: 2px solid rgba(255, 255, 255, 1);
  border-spacing: 0;
  background: ${(props) =>
    props.isOutsideDay
      ? "white"
      : props.selectedStart
      ? `linear-gradient(to top left, rgb(0, 143, 148)  49%, transparent 49%, transparent 51%,  ${props.color} 51%)`
      : props.selectedEnd
      ? `linear-gradient(to top left, ${props.color}  49%, transparent 49%, transparent 51%,  rgb(0, 143, 148) 51%)`
      : props.checkIn
      ? `linear-gradient(to top left, ${props.color} 50%, transparent 50%)`
      : `linear-gradient(to bottom right, ${props.color} 50%, transparent 50%)`};
  border-radius: 7px; /* Set the border-radius for slightly rounded corners */
  &:hover {
    background: rgb(0, 143, 148);
    color: white;
  }
`;
