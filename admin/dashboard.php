<?php
session_start();
if(!isset($_SESSION['admin_logged_in'])) {
    header('Location: login.php');
    exit();
}

require_once '../config.php';

// Handle app deletion
if(isset($_GET['delete'])) {
    $id = $_GET['delete'];
    $stmt = $pdo->prepare("DELETE FROM apps WHERE id = ?");
    $stmt->execute([$id]);
    header('Location: dashboard.php');
}

// Get all apps
$stmt = $pdo->query("SELECT * FROM apps ORDER BY created_at DESC");
$apps = $stmt->fetchAll();
?>

<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <title>Dashboard - OP ASHISH YT</title>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
    <div class="dashboard">
        <header>
            <h1>Admin Dashboard</h1>
            <a href="logout.php" class="logout-btn">Logout</a>
        </header>
        
        <div class="dashboard-content">
            <div class="actions">
                <a href="add-app.php" class="btn-primary">Add New App</a>
                <a href="../index.php" target="_blank" class="btn-secondary">View Website</a>
            </div>
            
            <h2>All Apps</h2>
            <table class="apps-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Version</th>
                        <th>Downloads</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach($apps as $app): ?>
                    <tr>
                        <td><?= $app['id'] ?></td>
                        <td><?= htmlspecialchars($app['name']) ?></td>
                        <td><?= $app['version'] ?></td>
                        <td><?= $app['downloads'] ?></td>
                        <td>
                            <a href="add-app.php?edit=<?= $app['id'] ?>">Edit</a>
                            <a href="?delete=<?= $app['id'] ?>" onclick="return confirm('Are you sure?')">Delete</a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>