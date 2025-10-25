const plants = document.querySelectorAll('.plant'); 
const terrarium_jar = document.getElementById('terrarium');

let zIndexCounter = 1;


plants.forEach(plant => {
    plant.addEventListener("dragstart", (e) => { //사용자가 요소나 텍스트 블록을 드래그하기 시작했을 때 발생한다.
        e.dataTransfer.setData('text/plain', e.target.id);
        zIndexCounter++;
        e.target.style.zIndex = zIndexCounter;
    });

    plant.addEventListener("dblclick", (e) => { //더블클릭 했을 경우
        e.preventDefault();
        zIndexCounter++;
        e.target.style.zIndex = zIndexCounter;
    });
});

document.body.addEventListener("dragover", (e) => { //요소나 텍스트 블록을 적합한 드롭 대상 위로 지나갈 때 발생한다. -> 테라리움 병 위를 지나갈 때
    e.preventDefault();
});

document.body.addEventListener("drop", (e) => { //요소나 텍스트 블록을 적합한 드롭 대상에 드롭했을 때 발생한다
    e.preventDefault();
    const plantId = e.dataTransfer.getData('text/plain'); //dragstart에서 저장한 targetID 불러오기 
    const draggedPlant = document.getElementById(plantId);
    const pos1 = e.clientX; //마우스X좌표
    const pos2 = e.clientY; //마우스Y좌표
    let pos3 = pos1 - draggedPlant.offsetWidth/2; //마우스X좌표는 이미지의 모서리 끝. 따라서 이미지 크기/2를 빼서 마우스X좌표가 이미지 가운데를 가리키게 함!
    let pos4 = pos2 - draggedPlant.offsetHeight/2; //마우스Y좌표는 이미지의 모서리 끝. 따라서 이미지 크기/2를 빼서 마우스Y좌표가 이미지 가운데를 가리키게 함!let pos4 = pos2 - rect.top;
    draggedPlant.style.left = `${pos3}px`;
    draggedPlant.style.top = `${pos4}px`;
    document.body.appendChild(draggedPlant); //드래그 끝난 draggedPlant를 body 자식으로 바꿈
});