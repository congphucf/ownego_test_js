--question 1 
SELECT d.dept_id, d.dept_name, COALESCE(d2.emp_count, 0) as number_of_employee
FROM department d 
LEFT JOIN (
    SELECT dept_id, COUNT(*) AS emp_count
    FROM employee e
    WHERE e.emp_salary > 7000
    GROUP BY e.dept_id
) d2
ON d.dept_id = d2.dept_id;

--question 2
SELECT d.dept_id, d.dept_name,  d3.cnt as number_of_employee
FROM department d
JOIN(
	SELECT d2.dept_id, d2.cnt
	FROM(
		SELECT e.dept_id, AVG(e.emp_salary)as avg_slr, COUNT(*) as cnt
		FROM employee e
		GROUP BY e.dept_id
	) d2
	WHERE d2.avg_slr>7000
) d3
ON d3.dept_id = d.dept_id
