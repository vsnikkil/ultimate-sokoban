import boxImg from "../../assets/box.png";
import floorImg from "../../assets/floor.png";
import ramirezImg from "../../assets/ramirez.png";

const BOX = 0;
const FLOOR = 1;
const RAMIREZ = 2;

const BLOCK_SIZE = 100;
const ENTITIES = {};

const RAMIREZ_RIGHT = 0;
const RAMIREZ_LEFT = 1;
const RAMIREZ_DOWN = 2;
const RAMIREZ_UP = 3;
function resolveOrientation(previousMove) {
  if (typeof previousMove !== "object") {
    return RAMIREZ_UP;
  }

  if (previousMove.x > 0) {
    return RAMIREZ_RIGHT;
  }
  if (previousMove.y > 0) {
    return RAMIREZ_DOWN;
  }
  if (previousMove.x < 0) {
    return RAMIREZ_LEFT;
  }

  return RAMIREZ_UP;
}

let preloadDone = false;
export function preloadEntities(...params) {
  if (preloadDone) {
    return;
  }

  const entities = {
    [BOX]: boxImg,
    [FLOOR]: floorImg,
    [RAMIREZ]: ramirezImg
  };

  return Promise.all(
    Object.entries(entities).map(([entityId, entitySrc]) =>
      new Promise(resolveEntity => {
        const i = new Image();
        i.src = entitySrc;
        i.onload = () => resolveEntity([entityId, i]);
      })
    )).then((entityTuples) => {
      entityTuples.forEach(([id, e]) => {
        Object.defineProperty(ENTITIES, id, { value: e, enumerable: true })
      });
    }).then(() => preloadDone = true);
}

function checkForResize(ctx) {
  const { width, height } = ctx.canvas.getBoundingClientRect();

  if (ctx.canvas.width !== width) {
    ctx.canvas.width = width;
  }
  if (ctx.canvas.height !== height) {
    ctx.canvas.height = height;
  }
}

let t0, t1;
function render(ctx, worldData, player, previousMove) {
  t0 = performance.now();
  checkForResize(ctx);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  for (let i = 0; i < worldData.length; i++) {
    const currentRow = worldData[i];
    
    for (let j = 0; j < currentRow.length; j++) {
      const currentTile = currentRow[j];
      
      const floorParams = [
        ENTITIES[FLOOR],
        (j+(worldData.length - i))/2*BLOCK_SIZE - BLOCK_SIZE/2,
        (i+j)/4*BLOCK_SIZE + 1.5*BLOCK_SIZE,
        BLOCK_SIZE,
        BLOCK_SIZE / 2
      ]
      ctx.drawImage(...floorParams);

      if (player.y === i && player.x === j) {
        const orientation = resolveOrientation(previousMove);
        const ramirez = ENTITIES[RAMIREZ];
        const ramirezHeight = ramirez.height/(ramirez.width/4) * BLOCK_SIZE;
        const ramirezWidth = BLOCK_SIZE;
        const ramirezParams = [
          ENTITIES[RAMIREZ],
          orientation * ramirez.width/4,
          0,
          ramirez.width/4,
          ramirez.height,
          (j+(worldData.length - i))/2*BLOCK_SIZE - ramirezWidth/2,
          (i+j)/4*BLOCK_SIZE - ramirezHeight + 2*BLOCK_SIZE,
          ramirezWidth,
          ramirezHeight
        ]
        ctx.drawImage(...ramirezParams);
      }
      
      switch (currentTile) {
        case 'x':
          ctx.drawImage(
            ENTITIES[BOX],
            (j+(worldData.length - i))/2*BLOCK_SIZE - BLOCK_SIZE/2,
            (i+j)/4*BLOCK_SIZE - BLOCK_SIZE + 2*BLOCK_SIZE,
            BLOCK_SIZE,
            BLOCK_SIZE
          );
          break;
      }
    }
  }
  ctx.fillStyle = "black";
  t1 = performance.now();
  ctx.fillText(`Frame took ${Math.round(100*(t1-t0))/100} ms`, 10, 20);
}

export default render;
