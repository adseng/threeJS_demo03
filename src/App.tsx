import {useEffect} from "react";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {Object3D, Points} from "three";


function App() {


    useEffect(() => {
        // 创建three场景
        const scene = new THREE.Scene();
        // scene.background = new THREE.Color(0x000000);
        // 光源
        const pointLight = new THREE.PointLight(0x000000, 1, 100);
        pointLight.position.set(20, 20, 20);
        scene.add(pointLight);

        // 创建three相机
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(10, 10, 10)
        camera.lookAt(scene.position)
        // 创建three渲染器
        const renderer = new THREE.WebGLRenderer();
        // 设置渲染器的尺寸
        renderer.setSize(window.innerWidth, window.innerHeight);

        // 将渲染器挂载到页面上
        document.body.appendChild(renderer.domElement);
        // 相机控件
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true;

        const loader = new GLTFLoader()

        let big: Object3D | undefined
        loader.load(
            // 资源路径
            '/molang_3_d_copy.gltf'
            ,
            // 资源加载完成回调
            (gltf) => {
                scene.add(gltf.scene);
                big = scene.getObjectByName('Big')!;
                // 修改big的材质
                if (big) {
                    big.traverse(function (child) {
                        if (child.isMesh) {
                            if (child.name === 'Sphere_3' || child.name === 'Sphere_2') {
                                child.material = new THREE.MeshStandardMaterial({color: '#fe0000'})
                                return
                            }
                            child.material = new THREE.MeshStandardMaterial({color: '#FFFF00'})
                        }
                    })
                }
            },
            // 资源加载进度回调
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded')
            },
            // 资源加载失败回调
            () => {
                console.log('An error happened')
            })


        let t = 0
        let move: () => void = () => {
        }

        function animate() {
            requestAnimationFrame(animate);
            // if (big) {
            //     // 三角函数弹跳效果
            //     big.position.y += Math.cos(t++ * 0.1) * 10;
            // }
            move && move()
            renderer.render(scene, camera);
        }

        animate()

        // 监听键盘上下左右键
        window.addEventListener('keydown', (e) => {
            e.stopPropagation()
            e.preventDefault()
            if (!big || !move) return
            switch (e.code) {
                case 'ArrowUp':
                    move = () => {
                        big!.position.z += 10
                    }
                    break;
                case 'ArrowDown':
                    move = () => {
                        big!.position.z -= 10
                    }
                    break;
                case 'ArrowLeft':
                    move = () => {
                        big!.position.x -= 10
                    }
                    break;
                case 'ArrowRight':
                    move = () => {
                        big!.position.x += 10
                    }
                    break;
                // 跳
                case 'Space':
                    move = () => {
                        // 给big一个跳跃的动画
                        big!.position.y += 10
                    }
                    break;
            }
        })

        // 按键抬起
        window.addEventListener('keyup', (e) => {
            e.stopPropagation()
            e.preventDefault()

            if (!big || !move) return
            switch (e.code) {
                case 'ArrowUp':
                case 'ArrowDown':
                case 'ArrowLeft':
                case 'ArrowRight':
                case 'Space':
                    move = () => {
                    }
                    break;
            }
        })


    }, [])


    return <></>;
}

export default App;
