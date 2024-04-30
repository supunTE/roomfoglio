import { ReactNode, useEffect, useRef } from "react";
import { clamp } from "lodash";
import { Bodies, Engine, World } from "matter-js";
import uniqolor from "uniqolor";

type RigidBodyProps = {
  engine: Engine;
  world: World;
  sceneWidth: number;
  children: ReactNode;
};

export function RigidBody({
  engine,
  world,
  sceneWidth,
  children,
}: RigidBodyProps) {
  const bodyRef = useRef<HTMLDivElement>(null);

  const randomColor = uniqolor.random({
    saturation: [80, 100],
    lightness: 40,
  });

  useEffect(() => {
    console.log("RigidBody mounted", engine, world);
    if (!engine || !world || sceneWidth == 0) return;

    const rigidBodyWidth = bodyRef.current.clientWidth;
    // const rigidBodyHeight = bodyRef.current.clientHeight;

    console.log(sceneWidth);

    const rigidBody = {
      w: rigidBodyWidth,
      h: rigidBodyWidth,
      body: Bodies.circle(
        clamp(Math.random() * sceneWidth, 30, sceneWidth - 30),
        20,
        rigidBodyWidth / 2,
        {
          frictionAir: 0.05,
          restitution: 0.8,
          render: { fillStyle: "#F3F3F3" },
        }
      ),
      elem: bodyRef.current,
      render() {
        const { x, y } = this.body.position;
        this.elem.style.top = `${y - this.h / 2}px`;
        this.elem.style.left = `${x - this.w / 2}px`;
        this.elem.style.transform = `rotate(${this.body.angle}rad)`;
      },
    };

    World.add(world, rigidBody.body);

    let animationFrameId: number;
    (function render() {
      rigidBody.render();
      //   Engine.update(engine);
      animationFrameId = requestAnimationFrame(render);
    })();

    return () => {
      cancelAnimationFrame(animationFrameId);
      World.remove(world, rigidBody.body);
    };
  }, [engine, world, sceneWidth]);

  return (
    <div
      ref={bodyRef}
      className="absolute p-2 sm:p-6 lg:p-10 xl:p-14 text-sm sm:text-md lg:text-lg xl:text-xl w-max aspect-square rounded-full flex items-center justify-center"
      style={{ backgroundColor: randomColor.color }}
    >
      {children}
    </div>
  );
}
