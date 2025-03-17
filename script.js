import * as THREE from 'https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@latest/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7);
scene.add(light);

const loader = new GLTFLoader();
function loadModel(url, position, scale = 1, name = "") {
    loader.load(url, function (gltf) {
        const model = gltf.scene;
        model.position.set(...position);
        model.scale.set(scale, scale, scale);
        model.name = name;
        scene.add(model);
    }, undefined, function (error) {
        console.error(خطأ في تحميل ${url}:, error);
    });
}

// قائمة المراحل والاختيارات
const stages = [
    { name: "wake_up", correct: "https://gofile.io/d/d4Qkxk", wrong: "https://gofile.io/d/GPPgCw", text: "هل ستستيقظ فورًا؟" },
    { name: "brush_teeth", correct: "https://gofile.io/d/N3l690", wrong: "https://gofile.io/d/YvTTZF", text: "هل ستغسل أسنانك؟" },
    { name: "eat", correct: "https://gofile.io/d/WuxN1j", wrong: "https://gofile.io/d/F5aH1C", text: "ماذا ستأكل؟" },
    { name: "go_to_school", correct: "https://gofile.io/d/WWoNhs", wrong: "https://gofile.io/d/HxH0bg", text: "هل ستذهب مبكرًا؟" },
    { name: "help_family", correct: "https://gofile.io/d/Y501uo", wrong: "https://gofile.io/d/5v1Zdo", text: "هل ستساعد في المنزل؟" },
];

let currentStage = 0;

// تحميل المرحلة الأولى
function loadStage(stage) {
    document.getElementById("mission-box").textContent = 🎯 ${stage.text};

    // مسح المشهد القديم
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }

    // تحميل الخيارات
    loadModel(stage.correct, [-2, 0, 3], 0.5, "correct");
    loadModel(stage.wrong, [2, 0, 3], 0.5, "wrong");
}

window.addEventListener("click", function(event) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const object = intersects[0].object;
        
        if (object.name === "correct") {
            showFeedback("✅ رائع! اختيار صحيح!", "green");
            updateCoins(10);
        } else if (object.name === "wrong") {
            showFeedback("❌ حاول مرة أخرى!", "red");
        }
    }
});

// زر الانتقال إلى المرحلة التالية
document.getElementById("next-button").addEventListener("click", function() {
    currentStage++;
    if (currentStage < stages.length) {
        loadStage(stages[currentStage]);
    } else {
        document.getElementById("mission-box").textContent = "🎉 لقد أكملت جميع المراحل!";
        document.getElementById("next-button").style.display = "none";
    }
});

function showFeedback(message, color) {
    document.getElementById("mission-box").textContent = message;
    document.getElementById("mission-box").style.color = color;
}

let coinCount = 0;
function updateCoins(amount) {
    coinCount += amount;
    document.getElementById("coin-count").textContent = coinCount;
}

// تشغيل المرحلة الأولى
loadStage(stages[currentStage]);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();