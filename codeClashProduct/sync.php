<?php
$file = 'sync.json';

$data = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $instanceId = $_POST['instanceId'] ?? null;
    $time = isset($_POST['time']) ? intval($_POST['time']) : 0;
    $status = $_POST['status'] ?? 'unsolved';

    if (!$instanceId) {
        echo json_encode(['success' => false, 'error' => 'Instance ID missing']);
        exit;
    }

    $data[$instanceId] = ['time' => $time, 'status' => $status];

    $fileHandle = fopen($file, 'c+');
    if (flock($fileHandle, LOCK_EX)) {
        ftruncate($fileHandle, 0);
        fwrite($fileHandle, json_encode($data));
        flock($fileHandle, LOCK_UN);
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Could not lock file']);
    }
    fclose($fileHandle);
    exit;
}

echo json_encode($data);
?>
