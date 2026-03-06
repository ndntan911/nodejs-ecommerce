create table test_table (
    id INT not null,
    name VARCHAR(255) default NULL,
    age INT default NULL,
    address VARCHAR(255) default NULL,
    primary key (id)
) engine=InnoDB default charset=utf8mb4;

create definer = `tipjs`@`%` procedure `insert_data`()
begin
declare max_id INT default 1000000;
declare i INT default 1;
while i <= max_id do
insert into test_table (id, name, age, address) values (i, CONCAT('name', i), i%100, CONCAT('address', i));
set i = i + 1;
end while;
end;