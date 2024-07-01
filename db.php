<?php 

class DB {
    private $servername;
    private $username;
    private $password;
    private $dbname;
    public $conn;

    public function __construct() {
        $this->servername = "localhost";
        $this->username = "root";
        $this->password = "";
        $this->dbname = "speeliite";

        $this->conn = new mysqli($this->servername, $this->username, $this->password, $this->dbname);

        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }else{

        }
    }
    
}

?>