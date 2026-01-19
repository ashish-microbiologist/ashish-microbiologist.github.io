<?php
session_start();
if(!isset($_SESSION['admin_logged_in'])) {
    header('Location: login.php');
    exit();
}

require_once '../config.php';

$app = ['id' => '', 'name' => '', 'description' => '', 'version' => '', 'size' => ''];
$edit_mode = false;

// Edit mode
if(isset($_GET['edit'])) {
    $edit_mode = true;
    $id = $_GET['edit'];
    $stmt = $pdo->prepare("SELECT * FROM apps WHERE id = ?");
    $stmt->execute([$id]);
    $app = $stmt->fetch();
}

// Handle form submission
if($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = $_POST['name'];
    $description = $_POST['description'];
    $version = $_POST['version'];
    $size = $_POST['size'];
    
    // Handle file uploads
    $logo_path = $app['logo'] ?? '';
    $apk_path = $app['apk_file'] ?? '';
    
    if(isset($_FILES['logo']) && $_FILES['logo']['error'] == 0) {
        $logo_name = uniqid() . '_' . basename($_FILES['logo']['name']);
        $target_dir = "../uploads/images/";
        $target_file = $target_dir . $logo_name;
        move_uploaded_file($_FILES['logo']['tmp_name'], $target_file);
        $logo_path = "uploads/images/" . $logo_name;
    }
    
    if(isset($_FILES['apk_file']) && $_FILES['apk_file']['error'] == 0) {
        $apk_name = uniqid() . '_' . basename($_FILES['apk_file']['name']);
        $target_dir = "../uploads/apk/";
        $target_file = $target_dir . $apk_name;
        move_uploaded_file($_FILES['apk_file']['tmp_name'], $target_file);
        $apk_path = "uploads/apk/" . $apk_name;
    }
    
    if($edit_mode) {
        $id = $_POST['id'];
        $stmt = $pdo->prepare("UPDATE apps SET name=?, description=?, version=?, size=?, logo=?, apk_file=? WHERE id=?");
        $stmt->execute([$name, $description, $version, $size, $logo_path, $apk_path, $id]);
        $message = "App updated successfully!";
    } else {
        $stmt = $pdo->prepare("INSERT INTO apps (name, description, version, size, logo, apk_file) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$name, $description, $version, $size, $logo_path, $apk_path]);
        $message = "App added successfully!";
    }
    
    header('Location: dashboard.php?message=' . urlencode($message));
    exit();
}
?>

<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <title><?= $edit_mode ? 'Edit App' : 'Add App' ?> - OP ASHISH YT</title>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
    <div class="form-container">
        <h2><?= $edit_mode ? 'Edit App' : 'Add New App' ?></h2>
        <form method="POST" enctype="multipart/form-data">
            <?php if($edit_mode): ?>
                <input type="hidden" name="id" value="<?= $app['id'] ?>">
            <?php endif; ?>
            
            <input type="text" name="name" placeholder="App Name" value="<?= $app['name'] ?>" required>
            <textarea name="description" placeholder="App Description" rows="5" required><?= $app['description'] ?></textarea>
            <input type="text" name="version" placeholder="Version" value="<?= $app['version'] ?>" required>
            <input type="text" name="size" placeholder="Size (e.g., 50MB)" value="<?= $app['size'] ?>" required>
            
            <div class="file-upload">
                <label>App Logo:</label>
                <input type="file" name="logo" accept="image/*">
                <?php if($edit_mode && $app['logo']): ?>
                    <small>Current: <?= basename($app['logo']) ?></small>
                <?php endif; ?>
            </div>
            
            <div class="file-upload">
                <label>APK File:</label>
                <input type="file" name="apk_file" accept=".apk">
                <?php if($edit_mode && $app['apk_file']): ?>
                    <small>Current: <?= basename($app['apk_file']) ?></small>
                <?php endif; ?>
            </div>
            
            <button type="submit"><?= $edit_mode ? 'Update App' : 'Add App' ?></button>
            <a href="dashboard.php" class="btn-cancel">Cancel</a>
        </form>
    </div>
</body>
</html>