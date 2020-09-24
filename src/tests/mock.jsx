import styled from "styled-components"
const Star = styled.div.attrs(props => ({
    onClick: props.onClick,
    selected: props.selected
}))`
cursr:pointer;
height:25px;
width:25px;
float:left;
background:grey;
clip-path: polygon(
    50% 0%,
    63% 38%,
    100% 38%,
    69% 59%,
    82% 100%,
    50% 75%,
    18% 100%,
    31% 59%,
    0% 38%,
    37% 38%
);
& .selected {
    background:red
}

`
const StarRating = ({ starsSelected = 0, totalStars = 5, onRate = f => f }) =>
    <div>
        [...Array(totalStars)].map(n,i)=><Star key={i}
            selected={i < starsSelected} onClick={onRate(i + 1)} />
    </div>
const Color = ({ title, color }) => (<section>
    <h1>{title}</h1>
    <div style={{ backgroundColor: color }}> </div>
    <div>
        <StarRating starsSelected={rating} />
    </div>
</section>)
export default Color;

