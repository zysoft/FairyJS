<?php

if ($argc < 2) {
    echo <<<EOB
    
Please use {$argv[0]} /path/to/FairyJS/src/


EOB;
    exit(0);
}

if (!is_dir($argv[1])) {
    echo <<<EOB
    
Directory {$argv[1]} does not exist


EOB;
    exit(0);
}


$EXCLUSIONS = array('register', 'init');

$outpath = dirname(__FILE__).'/out/';
@mkdir($outpath);

$path = $argv[1];
if ($path[strlen($path) - 1] != '/') $path .= '/';

$renderer = new Renderer;

$d = opendir($path);
while ($file = readdir($d)) {
    if (!is_file($path.$file)) continue;

    echo "Parsing $file ... ";
    
    $f = file_get_contents($path.$file);
    
    preg_match_all('`(/\*\*.*?\*/)[\r\n]*(.*?)[\r\n]`s', $f, $parts);
    
    $functions = array();
    
    foreach ($parts[2] as $index => $func) {
        if (!preg_match('/(.*?)\s*:\s*function\s*\((.*?)\)/', $func, $matches)) continue;
        $func = trim($matches[1]);
        if (in_array($func, $EXCLUSIONS)) {
            continue;
        }
        $preParams = explode(',',$matches[2]);
        $funcDoc = $parts[1][$index];
        

        $params = array();
        
        foreach ($preParams as $param) {
            $param = trim($param);
            if (empty($param)) continue;
            if (preg_match_all('/@param[\s\t]+(.*?)[\s\t]+\[?'.str_replace(array('$','/'), array('\\$', '\\/'),$param).'\]?[\s\t]+(.*)/', $funcDoc, $info)) {
                $params[$param] = array('type' => str_replace(array('{', '}'), '', $info[1][0]), 'description' => $info[2][0]);
            } else {
                $params[$param] = array('type' => 'undefined', 'description' => '');
            }
            $params[$param]['isOptional'] = (strpos($params[$param]['type'], '=') !== false) || preg_match('/\['.$param.'\]/', $funcDoc);
        }

        $funcDoc = preg_replace('/\/?\*+\s+/s', '',$funcDoc);
        $funcDoc = preg_replace('/\*+\//s', '',$funcDoc);

        $return = array('type' => 'undefined', 'description' => '');
        if (preg_match_all('/@return[\s\t]+(.*?)[\s\t]+(.*)/', $funcDoc, $info)) {
            $return['type'] = str_replace(array('{', '}'), '', $info[1][0]);
            $return['description'] = $info[2][0];
        }
        $funcDoc = preg_replace('/@.*?[\r\n]/s', '',$funcDoc);
        
        $functions[$func] = array('description' => trim($funcDoc), 'params' => $params, 'return' => $return);

    }
    
    echo "Functions found - ".count($functions)."\n";

    $renderer->functions = $functions;
    $renderer->file = $file;
    file_put_contents($outpath.str_replace(array('fjs_', '.js'), array('d_',''),basename($file)).'.html', $renderer->render('tpl/funcs.phtml'));
}

closedir($d);





class Renderer {

    public function render($template) {
        ob_start();
        include $template;
        return ob_get_clean();
    }
}